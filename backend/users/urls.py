from django.urls import path

from .views import (
    UserProfileListCreateView,
    UserProfileDetailView,
)


urlpatterns = [

    path(
        "",
        UserProfileListCreateView.as_view(),
        name="user-list-create",
    ),

    path(
        "<int:pk>/",
        UserProfileDetailView.as_view(),
        name="user-detail",
    ),

]