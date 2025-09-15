"""
ASGI config for TMS project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
import os

setting_modules = 'TMS.deployee_settings' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'TMS.settings'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', setting_modules)

# Normal Django ASGI app
application = get_asgi_application()



