from cachetools import TTLCache
import hashlib

_cache: TTLCache = TTLCache(maxsize=500, ttl=300)

def cache_key(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()

def get_cached(text: str):
    return _cache.get(cache_key(text))

def set_cached(text: str, value: dict):
    _cache[cache_key(text)] = value