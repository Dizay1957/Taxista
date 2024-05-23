from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from .api.serializers import UserModelSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class CreateUserAPIVIEW(generics.CreateAPIView):
    serializer_class = UserModelSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Authenticate and generate tokens
        user = authenticate(email=request.data.get("email"), password=request.data.get("password"))
        if user:
            refresh = CustomTokenObtainPairSerializer.get_token(user)
            access_token = refresh.access_token
            response_data = {
                "data": serializer.data,
                "refresh": str(refresh),
                "access": str(access_token)
            }
        else:
            response_data = serializer.data

        return Response(response_data, status=status.HTTP_201_CREATED)

class RetrieveUserAPI(generics.RetrieveUpdateAPIView):
    serializer_class = UserModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
