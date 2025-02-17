from django.contrib import admin
from .models import Colaborador, Boneca, EmpresaParceira, Doador
# admin.site.register(Colaborador)

# Registre o modelo EmpresaParceira no admin
admin.site.register(EmpresaParceira)

admin.site.register(Boneca)
    
@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'data_nascimento')
    
admin.site.register(Doador)