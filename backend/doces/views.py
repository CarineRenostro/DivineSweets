from rest_framework import viewsets
from .models import Doce, Pedido
from .serializers import DoceSerializer, PedidoSerializer


class DoceViewSet(viewsets.ModelViewSet):
    queryset = Doce.objects.all()
    serializer_class = DoceSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer