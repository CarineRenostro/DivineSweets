from django.db import models


class Doce(models.Model):

    nome = models.CharField(
        max_length=120,
        help_text='Nome do doce, exibido no card (ex.: "Cookie Pistache").'
    )

    imagem = models.ImageField(
        upload_to='doces/',
        help_text='Foto do doce.'
    )

    ordem = models.PositiveIntegerField(
        default=100,
        help_text='Define a ordem de exibição na grade (menor aparece primeiro). Os doces padrão usam 1-8.'
    )

    padrao = models.BooleanField(
        default=False,
        help_text='Indica se é um dos doces padrão (carregados de fábrica). Pode ser editado ou removido normalmente pela área administrativa.'
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ordem', 'id']
        verbose_name = 'Doce'
        verbose_name_plural = 'Doces'

    def __str__(self):
        return self.nome


class Pedido(models.Model):

    nome = models.CharField(max_length=120)
    telefone = models.CharField(max_length=30)
    email = models.EmailField()
    endereco = models.CharField(max_length=255)
    pedido = models.TextField(help_text='Descrição do pedido feita pelo cliente.')

    atendido = models.BooleanField(
        default=False,
        help_text='Marque quando este pedido já tiver sido respondido/atendido.'
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'

    def __str__(self):
        return f'{self.nome} — {self.criado_em:%d/%m/%Y %H:%M}'