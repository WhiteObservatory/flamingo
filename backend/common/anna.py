"""Owner-only pilot. Fixed loopback SSH forward; never relay cookies or arbitrary URLs."""
from http.client import HTTPConnection, HTTPException

from django.http import HttpResponse
from django.views.decorators.cache import never_cache
from people.session import who
from people.админка import админ_ли


@never_cache
def pilot(request, action):
    if not админ_ли(who(request)):
        return HttpResponse(status=403)
    if request.headers.get("Origin") != "https://flamingo.plus":
        return HttpResponse(status=403)
    probe = action == "ready"
    if request.method != ("GET" if probe else "POST"):
        return HttpResponse(status=405)
    if not probe and action not in ("voice", "listen", "coach", "trace"):
        return HttpResponse(status=404)
    content = "audio/wav" if action == "listen" else "application/json"
    if not probe and request.content_type != content:
        return HttpResponse(status=415)
    limit = 330000 if action == "listen" else 4096
    body = request.read(limit + 1)
    if len(body) > limit:
        return HttpResponse(status=413)
    upstream = HTTPConnection("127.0.0.1", 28466, timeout=27)
    try:
        upstream.request("GET" if probe else "POST", "/" if probe else "/lesson-" + action,
                         body=None if probe else body,
                         headers={"Origin": "http://127.0.0.1:18466", "Content-Type": content})
        res = upstream.getresponse()
        if probe:
            return HttpResponse(status=204 if res.status == 200 and b"tutor-lesson.mjs" in res.read(100000) else 503)
        data = res.read(5000001)
        if len(data) > 5000000:
            return HttpResponse(status=502)
        return HttpResponse(data, status=res.status,
                            content_type="audio/wav" if action == "voice" else "application/json")
    except (OSError, HTTPException):
        return HttpResponse(status=503)
    finally:
        upstream.close()
