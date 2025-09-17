#deployee_settings.py
import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR
import cloudinary
import cloudinary.uploader
import cloudinary.api
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'localhost')]

CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME')]

DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY')
MIDDLEWARE = [  
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", 
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    
] 

CORS_ALLOWED_ORIGINS = [
    "https://transport-management-system-tms-2.onrender.com",  
    "https://transport-management-system-tms-3.onrender.com" 
]

CSRF_TRUSTED_ORIGINS = [
    "https://transport-management-system-tms-2.onrender.com",
    "https://transport-management-system-tms-3.onrender.com"
]


STORAGES = {
    "default":{
        "BACKEND":'django.core.files.storage.FileSystemStorage',

        
    },
    "staticfiles":{
        'BACKEND':"whitenoise.storage.CompressedStaticFilesStorage",
    }
}

DATABASES = {
    'default': dj_database_url.config(
        default= os.environ['DATABASE_URL'],
        conn_max_age=600
    )

}

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.environ.get("CLOUDINARY_API_KEY"),
    "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET"),
}

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"