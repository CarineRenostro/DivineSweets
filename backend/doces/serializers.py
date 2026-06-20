from rest_framework import serializers
from .models import Doce, Pedido

class DoceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doce
        fields = ['id', 'nome', 'imagem', 'ordem', 'padrao', 'criado_em', 'atualizado_em']
        read_only_fields = ['id', 'criado_em', 'atualizado_em']

class PedidoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pedido
        fields = ['id', 'nome', 'telefone', 'email', 'endereco', 'pedido', 'atendido', 'criado_em']
        read_only_fields = ['id', 'criado_em']