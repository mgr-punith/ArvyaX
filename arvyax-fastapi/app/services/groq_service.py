import json
import httpx
from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"
SYSTEM_PROMPT = (
    "You are an emotion analysis assistant. "
    "Analyze the journal entry and respond ONLY with valid JSON: "
    '{"emotion":"string","keywords":["string"],"summary":"string"}'
)

async def analyze_emotion(text: str) -> dict:
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            GROQ_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            },
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Analyze: {text}"},
                ],
                "temperature": 0.3,
                "max_tokens": 200,
            },
        )
        res.raise_for_status()
        content = res.json()["choices"][0]["message"]["content"].strip()
        clean = content.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)

async def analyze_emotion_stream(text: str):
    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream(
            "POST",
            GROQ_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            },
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Analyze: {text}"},
                ],
                "temperature": 0.3,
                "max_tokens": 200,
                "stream": True,
            },
        ) as res:
            full = ""
            async for line in res.aiter_lines():
                if not line.startswith("data: ") or line == "data: [DONE]":
                    continue
                try:
                    chunk = json.loads(line[6:])
                    token = chunk["choices"][0]["delta"].get("content", "")
                    full += token
                    yield token
                except Exception:
                    continue
            clean = full.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            yield f"\n__RESULT__:{clean}"