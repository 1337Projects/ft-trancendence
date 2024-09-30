from django.urls import path
from . import views
from login.views import google_login, google_oauth

urlpatterns = [
    path('refresh/', views.refresh_token_view),
    path('logout/', views.logout),
    path('oauth/intra/', views.intra_oauth),
    path('google/', google_login, name='google_login'),
    path('google_callback/', google_oauth, name='google_callback'),
]