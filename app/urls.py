
from django.contrib import admin
from django.urls import path
from app import views
from app.views import login_view  
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from .views import cadastrar_boneca_view,gestao_bonecas_view

app_name = "manguetown"
urlpatterns = [
    path('home', views.home, name='home'),
    path('sobre/', views.sobre, name='sobre'),
    path('', views.login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('contato/', views.contato, name='contato'),
    path('registro/', views.registro_view, name='registro'),
    # path('escolha-cadastro/', views.escolha_cadastro_view, name='escolha_cadastro'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('gestao_colaboradores/', views.gestao_colaboradores_view, name='gestao_colaboradores'),
    path('cadastrar_colaborador/', views.cadastrar_colaborador_view, name='cadastrar_colaborador'),
    path('cadastro_empresa/', views.cadastro_empresa_view, name='cadastro_empresa'),
    path('editar_empresa/', views.editar_empresa_view, name='editar_empresa'),
    path('gestao_empresas/', views.gestao_empresas_view, name='gestao_empresas'),
    path('cadastrar_boneca/', cadastrar_boneca_view, name='cadastrar_boneca'),
    path('gestao_bonecas/', gestao_bonecas_view, name='gestao_bonecas'),
    path('editar_empresa/<int:empresa_id>/', views.editar_empresa_view, name='editar_empresa'),
    path('editar_boneca/<int:id>/', views.editar_boneca_view, name='editar_boneca'),
    path('gestao_doadores/', views.gestao_doadores_view, name='gestao_doadores'),
    path('cadastrar_doador/', views.cadastrar_doador_view, name='cadastrar_doador'),
    path('editar_doadores/<int:doador_id>/', views.editar_doador_view, name='editar_doador'),
    path('editar_colaborador/<int:id>/', views.editar_colaborador_view, name='editar_colaborador'),
    path('gestao_trabalho/', views.gestao_trabalho_view, name='gestao_trabalho'),
    path('cadastrar_trabalho/', views.cadastrar_trabalho_view, name='cadastrar_trabalho'),
    path('editar_trabalho/<int:trabalho_id>/', views.editar_trabalho_view, name='editar_trabalho'),
    path('relatorios/', views.relatorios_view, name='relatorios'),
    path('reverter/<int:trabalho_id>/', views.reverter_trabalho, name='reverter_trabalho'),
    path('concluir_trabalho/<int:trabalho_id>/', views.concluir_trabalho, name='concluir_trabalho'),
]