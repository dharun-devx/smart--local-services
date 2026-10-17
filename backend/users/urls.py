from django.urls import path

from .views import (
    UserProfileListCreateView,
    UserProfileDetailView,
    login_view,
    forgot_password_view,
    reset_password_view,
)


urlpatterns = [

    # ==========================================
    # USERS
    # ==========================================

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


    # ==========================================
    # LOGIN
    # ==========================================

    path(
        "login/",
        login_view,
        name="user-login",
    ),


    # ==========================================
    # FORGOT PASSWORD
    # ==========================================

    path(
        "forgot-password/",
        forgot_password_view,
        name="forgot-password",
    ),


    # ==========================================
    # RESET PASSWORD
    # ==========================================

    path(
        "reset-password/",
        reset_password_view,
        name="reset-password",
    ),

]