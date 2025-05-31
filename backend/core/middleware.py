from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
import json
from typing import Dict, Any
import redis
import os

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware to prevent API abuse."""
    
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            self.redis_client = redis.from_url(redis_url)
        except:
            self.redis_client = None

    async def dispatch(self, request: Request, call_next):
        if self.redis_client is None:
            # If Redis is not available, skip rate limiting
            return await call_next(request)
        
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}"
        
        try:
            current = self.redis_client.get(key)
            if current is None:
                self.redis_client.setex(key, self.window_seconds, 1)
            else:
                current_count = int(current)
                if current_count >= self.max_requests:
                    raise HTTPException(
                        status_code=429, 
                        detail="Rate limit exceeded. Please try again later."
                    )
                self.redis_client.incr(key)
        except redis.RedisError:
            # If Redis fails, allow the request
            pass
        
        return await call_next(request)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

def sanitize_input(data: Any) -> Any:
    """Sanitize input data to prevent injection attacks."""
    if isinstance(data, str):
        # Basic HTML/script tag removal
        import re
        data = re.sub(r'<[^>]*>', '', data)
        # Remove potential SQL injection patterns
        dangerous_patterns = [
            r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)',
            r'(\bunion\b.*\bselect\b)',
            r'(\b(script|javascript|vbscript)\b)',
        ]
        for pattern in dangerous_patterns:
            data = re.sub(pattern, '', data, flags=re.IGNORECASE)
        return data.strip()
    elif isinstance(data, dict):
        return {key: sanitize_input(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    return data 