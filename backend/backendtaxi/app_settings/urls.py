from django.urls import path
from app_settings.views import SiteConfigsAPIVIEW

urlpatterns = [
    path('site/', SiteConfigsAPIVIEW.as_view(), name='site-configs'),
]