from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Colaborador(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    data_nascimento = models.DateField(null=True, blank=True)
    lugar_onde_mora = models.CharField(max_length=255)
    renda = models.DecimalField(max_digits=10, decimal_places=2)
    situacoes_de_vulnerabilidade = models.TextField(blank=True, null=True, default='Não especificado')
    quantos_filhos = models.PositiveIntegerField(default=0)
    quantas_pessoas_moram_com_voce = models.PositiveIntegerField(default=0)
    habilidades = models.TextField(default='Não especificado')

    def __str__(self):
        return self.nome


class EmpresaParceira(models.Model):
    nome_responsavel = models.CharField(max_length=100, default='Nome Padrão')
    nome_empresa = models.CharField(max_length=100, default='Nome Padrão')
    captacao_local = models.CharField(max_length=100, default='Local não especificado')
    disponibilidade_residuo = models.CharField(max_length=100, default='Não especificado')
    porte_fabrico = models.CharField(
        max_length=50,
        choices=[('pequeno', 'Pequeno'), ('medio', 'Médio'), ('grande', 'Grande')],
        default='pequeno'
    )
    tipo_residuo = models.CharField(max_length=100, default='Não especificado')
    condicao_residuo = models.TextField(default='Não especificado')
    
    # O campo `usuario` não deve ter valor padrão; o usuário logado será associado aqui
    #usuario = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome_empresa

class Boneca(models.Model):
    nome = models.CharField(max_length=100)
    nivel_dificuldade = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    def __str__(self):
        return self.nome
    
class Doador(models.Model):
    TIPO_DOADOR_CHOICES = [
        ('Financiador', 'Financiador'),
        ('Resíduo', 'Resíduo'),
    ]
    
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    data_nascimento = models.DateField(null=True, blank=True)
    lugar_onde_mora = models.CharField(max_length=255)
    individual = models.BooleanField(default=True)  # True para individual, False para coletivo
    tipo_doador = models.CharField(max_length=30, choices=TIPO_DOADOR_CHOICES)
    data_disponibilidade = models.DateField(null=True, blank=True)
    local_captacao = models.CharField(max_length=255, null=True, blank=True)
    condicao_residuo = models.CharField(max_length=255, null=True, blank=True)
    tipo_residuo = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.nome

class Trabalho(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('expirado', 'Expirado'),
        ('concluido', 'Concluído'),
    ]
    
    boneca = models.ForeignKey(Boneca, on_delete=models.CASCADE)
    colaboradores = models.ManyToManyField(Colaborador)
    data_previsao = models.DateField()
    quantidade = models.PositiveIntegerField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ativo',
    )
    data_conclusao = models.DateField(null=True, blank=True)  # Novo campo

    def __str__(self):
        return f"Trabalho de {self.quantidade} {self.boneca.nome}(s)"


