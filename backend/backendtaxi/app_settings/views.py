from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import SiteSettings
from .api.serializers import AppConfigSettingsSerializer

class SiteConfigsAPIVIEW(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AppConfigSettingsSerializer
    queryset = SiteSettings.objects.all()