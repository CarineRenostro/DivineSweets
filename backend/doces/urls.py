from rest_framework.routers import DefaultRouter
from .views import DoceViewSet, PedidoViewSet

router = DefaultRouter()
router.register(r'doces', DoceViewSet, basename='doce')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

urlpatterns = router.urls