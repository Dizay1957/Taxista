from rest_framework import serializers
from app_settings.models import SiteSettings

class AppConfigSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'