import json
import urllib.request
import urllib.error

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def chatbot_api(request):
    try:
        data = json.loads(request.body)
        user_message = data.get("message", "").strip()

        if not user_message:
            return JsonResponse(
                {"error": "Please enter a message."},
                status=400,
            )

        ollama_payload = {
            "model": "mervinpraison/tamilan-2:2b",
            "messages": [
                {
                    "role": "system",
                 "content": (
    "You are a helpful assistant for Smart Local Services Platform. "
    "Help users with plumbing, electrical work, cleaning, computer repair, "
    "and other local services. "
    "If the user writes in English, reply in English. "
    "If the user writes in Tamil, reply in Tamil. "
    "Keep replies short, clear, and relevant. "
    "Never claim a booking is confirmed unless the application verifies it."
),
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 120,
            },
        }

        body = json.dumps(ollama_payload).encode("utf-8")

        ollama_request = urllib.request.Request(
            "http://127.0.0.1:11434/api/chat",
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(
            ollama_request,
            timeout=120,
        ) as response:
            result = json.loads(response.read().decode("utf-8"))

        reply = result.get("message", {}).get("content", "").strip()

        return JsonResponse({"reply": reply})

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON request."},
            status=400,
        )

    except urllib.error.URLError:
        return JsonResponse(
            {"error": "Ollama is not available. Please start Ollama."},
            status=503,
        )

    except Exception:
        return JsonResponse(
            {"error": "Something went wrong in the chatbot."},
            status=500,
        )