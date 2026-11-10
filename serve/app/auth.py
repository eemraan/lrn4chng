"""HMAC request signing (M35).

Every request must carry:
  X-Api-Timestamp: unix seconds
  X-Api-Signature: hex HMAC-SHA256(secret, "<ts>\n<METHOD>\n<path>\n<sha256(body)>")

The secret comes from the API_SECRET environment variable (never hardcoded).
Timestamps outside +/- MAX_SKEW_SECONDS are rejected (replay protection).
"""
import hashlib
import hmac
import os
import time

from fastapi import HTTPException, Request, status

MAX_SKEW_SECONDS = 300  # 5 minutes


def _secret() -> bytes:
    secret = os.getenv("API_SECRET", "")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API_SECRET is not configured on the server",
        )
    return secret.encode("utf-8")


def _sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def expected_signature(secret: bytes, ts: str, method: str, path: str, body: bytes) -> str:
    canonical = f"{ts}\n{method.upper()}\n{path}\n{_sha256_hex(body)}".encode("utf-8")
    return hmac.new(secret, canonical, hashlib.sha256).hexdigest()


async def verify_signature(request: Request) -> None:
    ts = request.headers.get("X-Api-Timestamp", "")
    sig = request.headers.get("X-Api-Signature", "")

    if not ts or not sig:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-Api-Timestamp / X-Api-Signature headers",
        )

    try:
        ts_int = int(ts)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid timestamp")

    if abs(time.time() - ts_int) > MAX_SKEW_SECONDS:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Stale timestamp")

    # Multipart uploads (camera) are signed with an empty body hash — the client
    # cannot hash a FormData stream; the signature still authenticates the call.
    if request.headers.get("content-type", "").startswith("multipart/"):
        body = b""
    else:
        body = await request.body()
    expected = expected_signature(_secret(), ts, request.method, request.url.path, body)

    if not hmac.compare_digest(expected, sig.lower()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid signature")
