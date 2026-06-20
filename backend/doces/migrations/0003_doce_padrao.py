from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.db import migrations, models

DOCES_PADRAO = [
    (1, 'Cookie Chocolate Tradicional', 'chocolate-tradicional.jpg'),
    (2, 'Cookie Chocomenta', 'cookie-chocomenta.jpg'),
    (3, 'Cookie Amendoim', 'cookie-amendoim-1.jpeg'),
    (4, 'Cookie Pistache', 'cookie-pistache.jpg'),
    (5, 'Cookie Chocolate e Laranja', 'cookie-choco-laranja.jpg'),
    (6, 'Cookie Limão Siciliano e Geléia de Morango', 'cookie-limao-morango.jpg'),
    (7, 'Cookie Brigadeiro e Bacon', 'cookie-brigadeiro-bacon.jpg'),
    (8, 'Brownie', 'brownie.jpg'),
]


def seed_doces_padrao(apps, schema_editor):
    Doce = apps.get_model('doces', 'Doce')

    if Doce.objects.filter(padrao=True).exists():
        return

    pasta_imagens = Path(settings.BASE_DIR).parent / 'frontend' / 'imagens'

    for ordem, nome, arquivo in DOCES_PADRAO:
        doce = Doce(nome=nome, ordem=ordem, padrao=True)
        caminho_origem = pasta_imagens / arquivo
        if caminho_origem.exists():
            with open(caminho_origem, 'rb') as f:
                doce.imagem.save(arquivo, File(f), save=False)
        else:
            print(f'[aviso] imagem não encontrada para seed: {caminho_origem}')
        doce.save()

    Doce.objects.filter(padrao=False, ordem=0).update(ordem=100)


def remover_doces_padrao(apps, schema_editor):
    Doce = apps.get_model('doces', 'Doce')
    Doce.objects.filter(padrao=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('doces', '0002_pedido'),
    ]

    operations = [
        migrations.AddField(
            model_name='doce',
            name='padrao',
            field=models.BooleanField(
                default=False,
                help_text='Indica se é um dos doces padrão (carregados de fábrica). Pode ser editado ou removido normalmente pela área administrativa.'
            ),
        ),
        migrations.AlterField(
            model_name='doce',
            name='ordem',
            field=models.PositiveIntegerField(
                default=100,
                help_text='Define a ordem de exibição na grade (menor aparece primeiro). Os doces padrão usam 1-8.'
            ),
        ),
        migrations.RunPython(seed_doces_padrao, remover_doces_padrao),
    ]