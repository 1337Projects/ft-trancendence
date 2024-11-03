from django.urls import path
from . import views
from login.views import google_login, google_oauth, forget_password, confirm_password, change_password

from .user_registration_views import (
    UserRegistrationView,
    UserLoginView,
)

urlpatterns = [
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/login/', UserLoginView.as_view(), name='login'),
    path('refresh/', views.refresh_token_view),
    path('logout/', views.logout),
    path('oauth/intra/', views.intra_oauth),
    path('google/', google_login, name='google_login'),
    path('google_callback/', google_oauth, name='google_callback'),
    path('forgetPassword/', forget_password, name='forget_password'),
    path('confirmPassword/', confirm_password, name='confirm_password'),
    path('changePassword/', change_password, name='change_password'),
]