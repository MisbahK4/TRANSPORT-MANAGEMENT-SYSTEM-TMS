"""
ASGI config for TMS project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TMS.settings')

# Normal Django ASGI app
application = get_asgi_application()

# Add this for Vercel
app = application  # <-- Vercel will now see 'app' as the entrypoint
