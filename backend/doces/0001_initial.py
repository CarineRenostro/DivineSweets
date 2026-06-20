from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Doce',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Nome do doce, exibido no card (ex.: "Cookie Pistache").', max_length=120)),
                ('imagem', models.ImageField(help_text='Foto do doce.', upload_to='doces/')),
                ('ordem', models.PositiveIntegerField(default=0, help_text='Define a ordem de exibição na grade (menor aparece primeiro).')),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Doce',
                'verbose_name_plural': 'Doces',
                'ordering': ['ordem', 'id'],
            },
        ),
    ]