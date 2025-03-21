
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('login.urls')),
    path('api/profile/', include('account.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/users/', include('login.urls')),
    path('api/friends/', include('account.urls')),
    path('api/tournment/', include('tournment.urls')),
    path('api/game/', include('game.urls')),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
