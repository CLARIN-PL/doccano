from django.conf import settings
from django.urls import reverse
from django.shortcuts import resolve_url
from django.views.generic.base import RedirectView
from django.contrib.auth import logout
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer
from projects.permissions import IsProjectAdmin


class Me(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class Users(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated & IsProjectAdmin]
    pagination_class = None
    filter_backends = (DjangoFilterBackend, filters.SearchFilter)
    search_fields = ("username",)


class KeycloakLogout(RedirectView):
    def get_redirect_url(self, *args, **kwargs):
        if hasattr(self.request.user, "oidc_profile"):
            self.request.realm.client.openid_api_client.logout(
                self.request.user.oidc_profile.refresh_token
            )
            self.request.user.oidc_profile.access_token = None
            self.request.user.oidc_profile.expires_before = None
            self.request.user.oidc_profile.refresh_token = None
            self.request.user.oidc_profile.refresh_expires_before = None
            self.request.user.oidc_profile.save(update_fields=[
                "access_token",
                "expires_before",
                "refresh_token",
                "refresh_expires_before"
            ])
        logout(self.request)
        if settings.LOGOUT_REDIRECT_URL:
            return resolve_url(settings.LOGOUT_REDIRECT_URL)
        return reverse("login")
