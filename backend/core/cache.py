import redis
import json
from typing import Any, Optional
import os
from dotenv import load_dotenv
from datetime import datetime, date

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)

class RedisCache:
    def __init__(self):
        self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        data = self.redis_client.get(key)
        return json.loads(data) if data else None
    
    def set(self, key: str, value: Any, expire: int = 300) -> None:
        """Set value in cache with expiration in seconds."""
        self.redis_client.setex(
            key,
            expire,
            json.dumps(value, cls=DateTimeEncoder)
        )
    
    def delete(self, key: str) -> None:
        """Delete value from cache."""
        self.redis_client.delete(key)
    
    def clear_pattern(self, pattern: str) -> None:
        """Clear all keys matching pattern."""
        keys = self.redis_client.keys(pattern)
        if keys:
            self.redis_client.delete(*keys)

# Create a singleton instance
cache = RedisCache() 