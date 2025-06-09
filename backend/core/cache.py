import redis
import json
import os
import sys
from typing import Any, Optional
from dotenv import load_dotenv
from datetime import datetime, date

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
IS_TESTING = (
    os.getenv("TESTING", "false").lower() == "true" or 
    "pytest" in sys.modules or 
    "test" in sys.argv[0] if sys.argv else False
)

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)

class MockRedisCache:
    """Mock Redis cache for testing."""
    def __init__(self):
        self._data = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        data = self._data.get(key)
        return json.loads(data) if data else None
    
    def set(self, key: str, value: Any, expire: int = 300) -> None:
        """Set value in cache with expiration in seconds."""
        self._data[key] = json.dumps(value, cls=DateTimeEncoder)
    
    def delete(self, key: str) -> None:
        """Delete value from cache."""
        self._data.pop(key, None)
    
    def clear_pattern(self, pattern: str) -> None:
        """Clear all keys matching pattern."""
        # Simple pattern matching for tests
        if '*' in pattern:
            prefix = pattern.replace('*', '')
            keys_to_delete = [key for key in self._data if key.startswith(prefix)]
        else:
            keys_to_delete = [key for key in self._data if pattern in key]
        
        for key in keys_to_delete:
            del self._data[key]

class RedisCache:
    def __init__(self):
        self.redis_client = None
        if not IS_TESTING:
            try:
                self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
                # Test the connection
                self.redis_client.ping()
            except Exception as e:
                print(f"Warning: Redis connection failed: {e}")
                self.redis_client = None
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if self.redis_client is None:
            return None
        try:
            data = self.redis_client.get(key)
            return json.loads(data) if data else None
        except Exception:
            return None
    
    def set(self, key: str, value: Any, expire: int = 300) -> None:
        """Set value in cache with expiration in seconds."""
        if self.redis_client is None:
            return
        try:
            self.redis_client.setex(
                key,
                expire,
                json.dumps(value, cls=DateTimeEncoder)
            )
        except Exception:
            pass
    
    def delete(self, key: str) -> None:
        """Delete value from cache."""
        if self.redis_client is None:
            return
        try:
            self.redis_client.delete(key)
        except Exception:
            pass
    
    def clear_pattern(self, pattern: str) -> None:
        """Clear all keys matching pattern."""
        if self.redis_client is None:
            return
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
        except Exception:
            pass

# Create the appropriate cache instance
if IS_TESTING:
    cache = MockRedisCache()
else:
    cache = RedisCache() 