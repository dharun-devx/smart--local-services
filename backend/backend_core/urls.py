from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Users API
    path("api/users/", include("users.urls")),

    # Services API
    path("api/services/", include("services.urls")),

    # Bookings API
    path("api/bookings/", include("bookings.urls")),

    # Reviews API
    path("api/reviews/", include("reviews.urls")),

    # AI Chatbot API
    path("api/chatbot/", include("chatbot.urls")),
]