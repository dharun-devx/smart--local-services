from rest_framework import generics

from .models import Service
from .serializers import ServiceSerializer


class ServiceListCreateView(generics.ListCreateAPIView):

    queryset = Service.objects.filter(
        is_active=True
    ).order_by("name")

    serializer_class = ServiceSerializer