# Architecture

## System Overview

```
Client (Next.js)
      |
FastAPI Backend
      |--- PostgreSQL (Neon DB)
      |--- Groq API (Llama 3.1 8B Instant)
      |--- In-Memory Cache (TTLCache)
```

The backend is stateless. Auth state lives in a signed JWT stored as an httpOnly cookie. The database holds users, journal entries, and analysis results.

---

## 1. How would you scale this to 100k users?

Run multiple FastAPI workers behind a load balancer. Since the app is stateless, horizontal scaling works without code changes. For the database, add read replicas — journal reads heavily outnumber writes, so splitting read and write traffic reduces load on the primary. The LLM call goes into a background job queue (Celery + Redis) so the HTTP response does not wait on Groq — the entry saves instantly and analysis populates shortly after.

---

## 2. How would you reduce LLM cost?

Only call the LLM when the user explicitly requests analysis, not automatically on every journal save. This alone eliminates most API calls. Combined with caching (described below), the majority of requests never reach the LLM at all.

---

## 3. How would you cache repeated analysis?

Already implemented using TTLCache in app/services/cache.py. The input text is hashed with MD5 and used as a cache key. If the same text is analyzed again within 5 minutes, the cached result is returned and the Groq API is not called. Analysis results are also stored permanently in the database — so once an entry is analyzed, it never needs to be analyzed again.

---

## 4. How would you protect sensitive journal data?

Three things matter here. First, the JWT is stored in an httpOnly cookie so JavaScript cannot read it, blocking XSS-based session theft. Second, every journal route checks that the requesting user matches the resource owner — no user can access another user's entries. Third, in production the backend runs behind HTTPS with secure=True on the cookie, and the Neon DB connection requires SSL.

---

## What is currently implemented

- JWT in httpOnly cookie
- Per-user data isolation at the route level
- In-memory analysis caching with 5 min TTL
- Permanent analysis storage in the database
- Rate limiting — 10 req/min on analyze, 60 req/min globally
- SSL required on all database connections