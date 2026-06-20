from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doces', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=120)),
                ('telefone', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254)),
                ('endereco', models.CharField(max_length=255)),
                ('pedido', models.TextField(help_text='Descrição do pedido feita pelo cliente.')),
                ('atendido', models.BooleanField(default=False, help_text='Marque quando este pedido já tiver sido respondido/atendido.')),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
                'ordering': ['-criado_em'],
            },
        ),
    ]