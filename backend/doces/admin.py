from django.contrib import admin
from .models import Doce, Pedido


@admin.register(Doce)
class DoceAdmin(admin.ModelAdmin):
    list_display = ['nome', 'ordem', 'padrao', 'atualizado_em']
    list_editable = ['ordem', 'padrao']
    list_filter = ['padrao']
    search_fields = ['nome']


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'telefone', 'email', 'atendido', 'criado_em']
    list_editable = ['atendido']
    list_filter = ['atendido']
    search_fields = ['nome', 'email', 'telefone']