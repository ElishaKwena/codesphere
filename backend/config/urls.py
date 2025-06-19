from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


schema_view = get_schema_view(
    
    openapi.Info(
        title="CodeSphere API",
        default_version='v1',
        description="""
        CodeSphere API Documentation
        
        The official API for CodeSphere, your all-in-one developer collaboration platform.
        Features include:
        - User authentication & profile management
        - Code snippet sharing
        - Developer social networking
        - Project collaboration tools
        
        For testing purposes, use these demo credentials:
        - Email: demo@codesphere.com
        - Password: demopassword123
        """,
        terms_of_service="https://codesphere.com/terms/",
        contact=openapi.Contact(
            name="CodeSphere Support",
            email="support@codesphere.com",
            url="https://codesphere.com/contact"
        ),
        license=openapi.License(
            name="CodeSphere License",
            url="https://codesphere.com/license"
        ),
        x_logo={
            "url": "https://codesphere.com/static/images/logo.png",
            "backgroundColor": "#FFFFFF",
            "altText": "CodeSphere Logo"
        }
    ),
    public=True,
    authentication_classes=[],  # Remove if you want to show auth in Swagger UI
    url="https://api.codesphere.com",  # Your production API URL
    patterns=[],  # Will be auto-
    permission_classes=[permissions.AllowAny],
)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    # path('api/posts/', include('posts.urls')),
    # path('api/groups/', include('groups.urls')),

    # JWT Token URLS
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    
    # Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
