from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
import re
from riders.models import RiderProfile

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['is_rider'] = user.is_rider
        token['is_driver'] = user.is_driver
        token['rider_profile_id'] = user.riderprofile.id if hasattr(user, 'riderprofile') else None
        
        return token

class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password", "driver_profile", "is_driver", "is_rider" )
        extra_kwargs = { "password":{ 'write_only' : True } }
        depth = 2

    def validate_password(self, value):
        min_length = 8
        has_uppercase = re.search(r'[A-Z]', value)
        has_lowercase = re.search(r'[a-z]', value)
        has_digit = re.search(r'[0-9]', value)
        has_special_char = re.search(r'[!@#$%^&*()\-_=+{};:,<.>]', value)

        if len(value) < min_length:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not (has_uppercase and has_lowercase and has_digit and has_special_char):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            )
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        user_pwd = validated_data["password"]

        if User.objects.filter(email=email.lower()).exists():
            raise serializers.ValidationError([{"Error":"Email address already exists."}])

        self.validate_password(user_pwd)
        user = User(**validated_data)
        user.set_password(user_pwd)
        user.save()

        if user.is_rider:
            RiderProfile.objects.create(user=user)

        return user