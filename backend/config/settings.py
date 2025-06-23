from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7ybtqckkvivn^^9161$c5zeh18-@k140-m171%y#^v&6-_+mgh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_yasg',
    
    'users.apps.UsersConfig',
    'groups.apps.GroupsConfig',
]

APPEND_SLASH = False

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',  
    
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    
    #  groups middleware
    'groups.middleware.SecurityHeadersMiddleware',
    'groups.middleware.GroupActivityMiddleware', 
    'groups.middleware.GroupAccessMiddleware',
]

# celery disabled for developments
# Celery configuration
USE_CELERY = False  # Set False for synchronous fallback
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # Broker
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'  # For task results
CELERY_TIMEZONE = 'UTC'  # Match Django's TIME_ZONE

# Conditional Celery beat schedule
if USE_CELERY:
    try:
        from celery.schedules import crontab
        CELERY_BEAT_SCHEDULE = {
            'expire-invites-nightly': {
                'task': 'groups.tasks.expire_invites',
                'schedule': crontab(hour=3, minute=0)  # 3 AM daily
            },
        }
    except ImportError:
        CELERY_BEAT_SCHEDULE = {}
else:
    CELERY_BEAT_SCHEDULE = {}

# Install requirements
# pip install celery redis

# Start Redis (in separate terminal)
# redis-server

# Start Celery worker
# celery -A yourproject worker --loglevel=info
# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        # ========== Core Security ==========
        'anon': '200/hour',
        'user': '5000/day',
        'register': '10/hour',
        'login': '30/hour',
        'password_reset': '5/hour',
        'verify_email': '10/hour',
        
        # ========== Group Management ==========
        'group-create': '3/day',          # POST /groups/
        'group-join': '10/hour',          # POST /groups/<id>/join/
        'group-invite': '20/hour',        # POST /groups/<id>/invites/create/
        'group-admin-action': '50/hour',  # Approvals, badge awards, etc.
        
        # ========== Content Operations ==========
        'listings': '1000/hour',
        'search': '500/hour',
        'profile': '300/hour',
        'heavy_operation': '50/hour',
        
        # ========== Analytics ==========
        'analytics': '100/hour'  # GET /groups/<id>/analytics/
    }
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

AUTH_USER_MODEL = 'users.CustomUser'

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    
]
CORS_ALLOW_CREDENTIALS = True


# Allowed methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Allowed headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Cache duration for preflight requests
CORS_PREFLIGHT_MAX_AGE = 86400

ROOT_URLCONF = 'config.urls'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (User uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Email Configuration (Example for Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'hatblack9874@gmail.com'
EMAIL_HOST_PASSWORD = 'nato npcn vxev cdha'
DEFAULT_FROM_EMAIL = 'hatblack9874@gmail.com'

# Frontend URLs
FRONTEND_LOGIN_URL = 'http://localhost:5174/login'
FRONTEND_LOGIN_URL = 'http://localhost:5173/login'
FRONTEND_VERIFY_URL = 'http://localhost:5174/verify-email/'
FRONTEND_RESET_URL = 'http://localhost:5174/reset-password/'
FRONTEND_VERIFY_URL = 'http://localhost:5173/verify-email/'
FRONTEND_RESET_URL = 'http://localhost:5173/reset-password/'


SWAGGER_SETTINGS = {
    'DEFAULT_INFO': 'your_app.urls.schema_view',  # Points to the schema_view above
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'LOGOUT_URL': '/admin/logout/'
}