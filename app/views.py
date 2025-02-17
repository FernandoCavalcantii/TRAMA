from django.db import IntegrityError
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import Colaborador, EmpresaParceira, Boneca, Doador, Colaborador, Trabalho
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
import re
from datetime import date,timedelta,datetime
from django.utils import timezone
from django.urls import reverse



def home(request):
    return render(request, 'home.html')

def sobre(request):
    return render(request, 'sobre.html')

def contato(request):
    return render(request, 'contato.html')

# View de login
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('manguetown:dashboard')
        else:
            messages.error(request, 'Usuário ou senha incorretos.')
    return render(request, 'login.html')

# View de registro de usuário
def registro_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST.get('email')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Esse nome de usuário já está em uso.')
            return render(request, 'registro.html')  # Renderize o formulário novamente
        user = User.objects.create_user(username=username, password=password, email=email)
        if not email:
            messages.error(request, 'O campo de e-mail é obrigatório.')
            return render(request, 'registro.html')
        user.save()
        return render(request, 'login.html')
    return render(request, 'registro.html')

# View para escolher a página de gestão
@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')

# View da página de gestão de colaboradores
def gestao_colaboradores_view(request):
    colaboradores = Colaborador.objects.all()
    return render(request, 'gestao_colaboradores.html', {'colaboradores': colaboradores})

# View da página de gestão de colaboradores
def gestao_empresas_view(request):
    empresas = EmpresaParceira.objects.all()
    return render(request, 'gestao_empresas.html', {'empresas': empresas})

# View da página de gestão de trabalho
def gestao_trabalho_view(request):
    trabalho = Trabalho.objects.all()
    return render(request, 'gestao_trabalho.html', {'trabalho': trabalho})

# View para o cadastro de colaborador
def cadastrar_colaborador_view(request):
    if request.method == 'POST':
        nome = request.POST['nome']
        cpf = request.POST['cpf']
        data_nascimento = request.POST['data_nascimento']
        lugar_onde_mora = request.POST['lugar_onde_mora']
        renda = request.POST['renda']
        situacoes_de_vulnerabilidade = request.POST['situacoes_de_vulnerabilidade']
        quantos_filhos = request.POST['quantos_filhos']
        quantas_pessoas_moram_com_voce = request.POST['quantas_pessoas_moram_com_voce']
        habilidades = request.POST['habilidades']
        
        # Verifica se o CPF contém apenas números
        if not re.match(r'^\d+$', cpf):
            messages.error(request, 'O CPF deve conter apenas números.')
            return redirect('manguetown:cadastrar_colaborador')
        
        # Verifica se o CPF já existe antes de tentar salvar
        if Colaborador.objects.filter(cpf=cpf).exists():
            messages.error(request, 'O CPF já está cadastrado. Por favor, insira um CPF diferente.')
            return redirect('manguetown:cadastrar_colaborador')  # Redireciona de volta ao formulário

        try:
            Colaborador.objects.create(
                nome=nome,
                cpf=cpf,
                data_nascimento=data_nascimento,
                lugar_onde_mora=lugar_onde_mora,
                renda=renda,
                situacoes_de_vulnerabilidade=situacoes_de_vulnerabilidade,
                quantos_filhos=quantos_filhos,
                quantas_pessoas_moram_com_voce=quantas_pessoas_moram_com_voce,
                habilidades=habilidades,
            )
            # Não mostrar mensagem de sucesso aqui
            return redirect('manguetown:gestao_colaboradores')  # Redireciona para a página de Gestão de Colaboradores

        except IntegrityError:
            messages.error(request, 'Erro ao cadastrar colaborador. Por favor, tente novamente.')
            return redirect('manguetown:cadastrar_colaborador')  # Redireciona de volta ao formulário

    return render(request, 'cadastrar_colaborador.html')


# View para cadastro de trabalho
def cadastrar_trabalho_view(request):
    if request.method == 'POST':
        boneca_id = request.POST.get('boneca_id')
        data_previsao = request.POST.get('data_previsao')
        quantidade = request.POST.get('quantidade')
        colaborador_ids = request.POST.getlist('colaborador_id')  # Coletar múltiplos colaboradores

        # Verificar se a data de previsão é no futuro
        if data_previsao and date.fromisoformat(data_previsao) <= date.today():
            messages.error(request, 'A data de previsão deve ser no futuro.')
            return redirect('manguetown:cadastrar_trabalho')
        
        try:
            boneca = Boneca.objects.get(id=boneca_id)

            trabalho = Trabalho.objects.create(
                    boneca=boneca,
                    data_previsao=data_previsao,
                    quantidade=quantidade
            )
            # Criar trabalho para cada colaborador selecionado
            for colaborador_id in colaborador_ids:
                colaborador = Colaborador.objects.get(id=colaborador_id)
                trabalho.colaboradores.add(colaborador)
                

            return redirect('manguetown:gestao_trabalho')

        except IntegrityError:
            messages.error(request, 'Erro ao cadastrar trabalho. Por favor, tente novamente.')
            return redirect('manguetown:cadastrar_trabalho')
    
    else:
        colaboradores = Colaborador.objects.all()
        bonecas = Boneca.objects.all()
        today = date.today().isoformat()  # Passar a data no formato correto

        context = {
            'colaboradores': colaboradores,
            'bonecas': bonecas,
            'today': today,  # Passando a data para o template
        }
        return render(request, 'cadastrar_trabalho.html', context)





# View para escolher tipo de cadastro
# def escolha_cadastro_view(request):
#     return render(request, 'escolha_cadastro.html')

# View de cadastro de colaboradora
# def cadastro_colaboradora_view(request):
#     usuario = request.user

#     if request.method == 'POST':
#         # Verifica se o usuário já tem uma instância de Colaboradora
#         if Colaboradora.objects.filter(usuario=usuario).exists():
#             # Se já existe, retorna uma mensagem de erro em vez de redirecionar
#             messages.error(request, "Você já está cadastrado como colaboradora.")
#             return render(request, 'cadastro_colaboradora.html')  # Renderiza a mesma página com mensagem

#         # Se não existe, cria a nova instância
#         colaboradora = Colaboradora(
#             nome=request.POST['nome'],
#             cpf=request.POST['cpf'],
#             lugar_onde_mora=request.POST['lugar_onde_mora'],
#             renda=request.POST['renda'],
#             situacoes_vulnerabilidade=request.POST['situacoes_vulnerabilidade'],
#             quantos_filhos=request.POST['quantos_filhos'],
#             quantas_pessoas_moram=request.POST['quantas_pessoas_moram'],
#             habilidades=request.POST['habilidades'],
#             usuario=usuario
#         )

#         try:
#             colaboradora.save()  # Tente salvar a colaboradora
#             messages.success(request, "Colaboradora cadastrada com sucesso!")  # Mensagem de sucesso
#             return redirect('manguetown:escolha_cadastro')  # Redireciona para a página de sucesso

#         except Exception as e:
#             messages.error(request, f"Ocorreu um erro ao cadastrar: {str(e)}")  # Mensagem de erro

#     return render(request, 'cadastro_colaboradora.html')  # Renderiza o template do for

# View de cadastro de empresa parceira
@login_required
def cadastro_empresa_view(request):
    if request.method == 'POST':
        nome_empresa = request.POST.get('nome_empresa')

        # Verifica se o usuário já possui um cadastro de empresa
        if EmpresaParceira.objects.filter(nome_empresa=nome_empresa).exists():
            messages.error(request, "Você já está cadastrado como empresa parceira.")
            return render(request, 'cadastro_empresa.html')

        # Criação de uma nova instância de EmpresaParceira
        empresa = EmpresaParceira(
            nome_responsavel=request.POST.get('nome_responsavel'),
            nome_empresa=nome_empresa,
            captacao_local=request.POST.get('captacao_local'),
            disponibilidade_residuo=request.POST.get('disponibilidade_residuo'),
            porte_fabrico=request.POST.get('porte_fabrico'),
            tipo_residuo=request.POST.get('tipo_residuo'),
            condicao_residuo=request.POST.get('condicao_residuo'),
            # Removido o campo 'usuario' da instância
        )

        try:
            empresa.save()  # Tenta salvar a nova empresa
            return redirect('manguetown:gestao_empresas')
        except Exception as e:
            messages.error(request, f"Erro ao cadastrar a empresa: {e}")

    return render(request, 'cadastro_empresa.html')

@login_required
def editar_empresa_view(request, empresa_id=None):
    # Busca a empresa existente usando o ID, se ele for fornecido
    empresa = None
    if empresa_id:
        try:
            empresa = EmpresaParceira.objects.get(id=empresa_id)
        except EmpresaParceira.DoesNotExist:
            messages.error(request, "Empresa não encontrada.")
            return redirect('manguetown:gestao_empresas')

    if request.method == 'POST':
        nome_empresa = request.POST.get('nome_empresa')

        # Verifica se o usuário está tentando cadastrar uma empresa com um nome já existente
        if not empresa and EmpresaParceira.objects.filter(nome_empresa=nome_empresa).exists():
            messages.error(request, "Uma empresa com esse nome já existe.")
            return render(request, 'editar_empresa.html', {'empresa': empresa})

        # Atualiza os dados da empresa existente ou cria uma nova instância
        if not empresa:
            empresa = EmpresaParceira()

        empresa.nome_responsavel = request.POST.get('nome_responsavel')
        empresa.nome_empresa = nome_empresa
        empresa.captacao_local = request.POST.get('captacao_local')
        empresa.disponibilidade_residuo = request.POST.get('disponibilidade_residuo')
        empresa.porte_fabrico = request.POST.get('porte_fabrico')
        empresa.tipo_residuo = request.POST.get('tipo_residuo')
        empresa.condicao_residuo = request.POST.get('condicao_residuo')

        try:
            empresa.save()  # Tenta salvar a empresa editada
            messages.success(request, "Empresa atualizada com sucesso!")
            return redirect('manguetown:gestao_empresas')
        except Exception as e:
            messages.error(request, f"Erro ao atualizar a empresa: {e}")

    # Carrega os dados da empresa existente no formulário
    context = {'empresa': empresa}
    return render(request, 'editar_empresa.html', context)

@login_required
def editar_trabalho_view(request, trabalho_id):
    # Buscar o trabalho existente pelo ID
    trabalho = get_object_or_404(Trabalho, id=trabalho_id)

    if request.method == 'POST':
        colaborador_ids = request.POST.getlist('colaborador_id')  # Recebe uma lista de IDs de colaboradores
        boneca_id = request.POST.get('boneca_id')
        data_previsao = request.POST.get('data_previsao')
        quantidade = request.POST.get('quantidade')

        # Verificar se a data de previsão é no futuro
        if data_previsao and date.fromisoformat(data_previsao) <= date.today():
            messages.error(request, 'A data de previsão deve ser no futuro.')
            return redirect('manguetown:editar_trabalho', trabalho_id=trabalho.id)

        try:
            # Obtendo a boneca
            boneca = Boneca.objects.get(id=boneca_id)

            # Atualizando os colaboradores (adicionando ou removendo)
            colaboradores = Colaborador.objects.filter(id__in=colaborador_ids)

            # Atualizando o trabalho com os novos dados
            trabalho.boneca = boneca
            trabalho.data_previsao = data_previsao
            trabalho.quantidade = quantidade
            trabalho.colaboradores.set(colaboradores)  # Atualiza os colaboradores com o método `set()`
            trabalho.save()

            messages.success(request, 'Trabalho atualizado com sucesso!')
            return redirect('manguetown:gestao_trabalho')

        except (Colaborador.DoesNotExist, Boneca.DoesNotExist):
            messages.error(request, 'Colaborador ou Boneca selecionados não existem.')
            return redirect('manguetown:editar_trabalho', trabalho_id=trabalho.id)
        except IntegrityError:
            messages.error(request, 'Erro ao editar trabalho. Por favor, tente novamente.')
            return redirect('manguetown:editar_trabalho', trabalho_id=trabalho.id)

    else:
        colaboradores = Colaborador.objects.all()
        bonecas = Boneca.objects.all()
        today = date.today().isoformat()  # Passar a data no formato correto

        context = {
            'trabalho': trabalho,
            'colaboradores': colaboradores,
            'bonecas': bonecas,
            'today': today,  # Passando a data para o template
        }
        return render(request, 'editar_trabalho.html', context)

@login_required
def gestao_colaboradores_view(request):
    if request.method == 'POST':
        colaborador_id = request.POST.get('colaborador_id')
        if colaborador_id:    
            try:
                colaborador = get_object_or_404(Colaborador, id=colaborador_id)
                colaborador.delete()
                messages.success(request, "Colaborador excluído com sucesso!")
            except Exception as e:
                messages.error(request, f"Erro ao excluir colaborador: {e}")
            
            return redirect('manguetown:gestao_colaboradores')

    colaboradores = Colaborador.objects.all()
    return render(request, 'gestao_colaboradores.html', {'colaboradores': colaboradores})

@login_required
def gestao_trabalho_view(request):
    filtro = request.GET.get('status', 'ativo')
    agora = datetime.now().date()  # Pega apenas a parte da data, sem hora

    # Atualiza o status dos trabalhos com data de previsão vencida para 'expirado'
    Trabalho.objects.filter(status='ativo', data_previsao__lt=agora).update(status='expirado')

    if request.method == 'POST':
        trabalho_id = request.POST.get('trabalho_id')
        if trabalho_id:    
            try:
                trabalho = get_object_or_404(Trabalho, id=trabalho_id)
                trabalho.delete()
                messages.success(request, "Trabalho excluído com sucesso!")
            except Exception as e:
                messages.error(request, f"Erro ao excluir trabalho: {e}")
            
            return redirect('manguetown:gestao_trabalho')

    # Filtra os trabalhos com base no status
    if filtro == 'ativo':
        trabalhos = Trabalho.objects.filter(status='ativo', data_previsao__gte=agora)
    elif filtro == 'expirado':
        trabalhos = Trabalho.objects.filter(status='expirado', data_previsao__lt=agora)
    elif filtro == 'concluido':
        trabalhos = Trabalho.objects.filter(status='concluido')
    else:
        trabalhos = Trabalho.objects.all()

    # Ordena os trabalhos pela data de previsão
    trabalhos = trabalhos.order_by("data_previsao")

    return render(request, 'gestao_trabalho.html', {'trabalhos': trabalhos, 'filtro': filtro})

from datetime import date

def concluir_trabalho(request, trabalho_id):
    if request.method == 'POST':
        try:
            trabalho = Trabalho.objects.get(id=trabalho_id)
            trabalho.status = 'concluido'
            trabalho.data_conclusao = date.today()  # Define a data de conclusão
            trabalho.save()
            messages.success(request, 'Trabalho concluído com sucesso.')
        except Trabalho.DoesNotExist:
            messages.error(request, 'Trabalho não encontrado.')
    return redirect('manguetown:gestao_trabalho')


def reverter_trabalho(request, trabalho_id):
    trabalho = get_object_or_404(Trabalho, id=trabalho_id)
    agora = datetime.now().date()  # Pega apenas a data atual
    data_previsao = trabalho.data_previsao
    

    # Define o status automaticamente com base na data de previsão
    if data_previsao < agora:
        trabalho.status = 'expirado'
    else:
        trabalho.status = 'ativo'

    trabalho.data_conclusao = None
    # Salva as alterações
    trabalho.save()

    return redirect(f"{reverse('manguetown:gestao_trabalho')}?status={trabalho.status}")

@login_required
def gestao_bonecas_view(request):
    if request.method == 'POST':
        boneca_id = request.POST.get('boneca_id')
        if boneca_id:    
            try:
                boneca = get_object_or_404(Boneca, id=boneca_id)
                boneca.delete()
                messages.success(request, "Boneca excluída com sucesso!")
            except Exception as e:
                messages.error(request, f"Erro ao excluir boneca: {e}")
            
            return redirect('manguetown:gestao_bonecas')

    bonecas = Boneca.objects.all()
    return render(request, 'gestao_bonecas.html', {'bonecas': bonecas})


@login_required
def gestao_doadores_view(request):
    if request.method == 'POST':
        doador_id = request.POST.get('doador_id')
        if doador_id:
            try:
                doador = get_object_or_404(Doador, id=doador_id)
                doador.delete()
                messages.success(request, "Doador excluído com sucesso!")
            except Exception as e:
                messages.error(request, f"Erro ao excluir doador: {e}")

            return redirect('manguetown:gestao_doadores')

    doadores = Doador.objects.all()
    return render(request, 'gestao_doadores.html', {'doadores': doadores})

@login_required
def gestao_empresas_view(request):
    if request.method == 'POST':
        empresa_id = request.POST.get('empresa_id')
        try:
            empresa = get_object_or_404(EmpresaParceira, id=empresa_id)
            empresa.delete()
            messages.success(request, "Empresa excluída com sucesso!")
        except Exception as e:
            messages.error(request, f"Erro ao excluir empresa: {e}")

        return redirect('manguetown:gestao_empresas')

    empresas = EmpresaParceira.objects.all()
    return render(request, 'gestao_empresas.html', {'empresas': empresas})

@login_required
def cadastrar_boneca_view(request):
    if request.method == 'POST':
        nome = request.POST.get('nome_boneca')
        nivel_dificuldade = request.POST.get('nivel_dificuldade')


        # Criação da nova boneca
        boneca = Boneca(
            nome=nome,
            nivel_dificuldade=nivel_dificuldade
        )

        try:
            boneca.save()  # Tenta salvar a nova boneca
            return redirect('manguetown:gestao_bonecas')  # Redireciona para a página de gestão de bonecas
        except Exception as e:
            messages.error(request, f"Erro ao cadastrar a boneca: {e}")

    return render(request, 'cadastrar_boneca.html')




@login_required
def cadastrar_doador_view(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        cpf = request.POST.get('cpf')
        data_nascimento = request.POST.get('data_nascimento')
        lugar_onde_mora = request.POST.get('lugar_onde_mora')
        individual = request.POST.get('individual') == 'True'  # Convertendo para booleano
        tipo_doador = request.POST.get('tipo_doador')
        data_disponibilidade = request.POST.get('data_disponibilidade')
        local_captacao = request.POST.get('local_captacao')
        condicao_residuo = request.POST.get('condicao_residuo')
        tipo_residuo = request.POST.get('tipo_residuo')

        # Verifica se o CPF já existe
        if Doador.objects.filter(cpf=cpf).exists():
            messages.error(request, 'O CPF já está cadastrado. Por favor, insira um CPF diferente.')
            return render(request, 'cadastrar_doador.html')  # Retorna ao formulário com mensagem

        # Se o tipo doador for Financiador, não preenche os outros campos
        if tipo_doador == 'Financiador':
            data_disponibilidade = None
            local_captacao = None
            condicao_residuo = None
            tipo_residuo = None

        doador = Doador(
            nome=nome,
            cpf=cpf,
            data_nascimento=data_nascimento,
            lugar_onde_mora=lugar_onde_mora,
            individual=individual,
            tipo_doador=tipo_doador,
            data_disponibilidade=data_disponibilidade,
            local_captacao=local_captacao,
            condicao_residuo=condicao_residuo,
            tipo_residuo=tipo_residuo
        )

        try:
            doador.save()  # Tenta salvar a nova doador
            messages.success(request, 'Doador cadastrado com sucesso!')
            return redirect('manguetown:gestao_doadores')  # Redireciona para a página de gestão de doadores
        except Exception:
            messages.error(request, 'Erro ao cadastrar doador. Por favor, tente novamente.')
            return render(request, 'cadastrar_doador.html')  # Retorna ao formulário com mensagem

    return render(request, 'cadastrar_doador.html')

@login_required
def editar_doador_view(request, doador_id):
    doador = get_object_or_404(Doador, id=doador_id)

    if request.method == 'POST':
        # Captura os dados do formulário
        nome = request.POST.get('nome')
        cpf = request.POST.get('cpf')
        data_nascimento = request.POST.get('data_nascimento')
        lugar_onde_mora = request.POST.get('lugar_onde_mora')
        individual = request.POST.get('individual') == 'True'
        tipo_doador = request.POST.get('tipo_doador')
        data_disponibilidade = request.POST.get('data_disponibilidade')
        local_captacao = request.POST.get('local_captacao')
        condicao_residuo = request.POST.get('condicao_residuo')
        tipo_residuo = request.POST.get('tipo_residuo')

        # Verifica se o CPF já existe e se não é o CPF do próprio doador
        if Doador.objects.filter(cpf=cpf).exclude(id=doador.id).exists():
            messages.error(request, 'O CPF já está cadastrado. Por favor, insira um CPF diferente.')
            return render(request, 'editar_doador.html', {'doador': doador})

        # Atualiza os dados do doador
        doador.nome = nome
        doador.cpf = cpf
        doador.data_nascimento = data_nascimento
        doador.lugar_onde_mora = lugar_onde_mora
        doador.individual = individual
        doador.tipo_doador = tipo_doador
        doador.data_disponibilidade = data_disponibilidade
        doador.local_captacao = local_captacao
        doador.condicao_residuo = condicao_residuo
        doador.tipo_residuo = tipo_residuo

        try:
            doador.save()  # Tenta salvar as alterações
            messages.success(request, 'Doador editado com sucesso!')
            return redirect('manguetown:gestao_doadores')  # Redireciona para a página de gestão de doadores
        except Exception:
            messages.error(request, 'Erro ao atualizar doador. Por favor, tente novamente.')
            return render(request, 'editar_doador.html', {'doador': doador})

    return render(request, 'editar_doador.html', {'doador': doador})



@login_required
def editar_colaborador_view(request, id):
    colaborador = get_object_or_404(Colaborador, id=id)

    if request.method == 'POST':
        # Obtém os dados do formulário
        colaborador.nome = request.POST['nome']
        cpf = request.POST['cpf']
        
        # Verifica se o CPF contém apenas números
        if not re.match(r'^\d+$', cpf):
            messages.error(request, 'O CPF deve conter apenas números.')
            return render(request, 'editar_colaborador.html', {'colaborador': colaborador})
        
        # Verifica se o CPF já existe antes de tentar salvar, ignorando o colaborador atual
        if Colaborador.objects.exclude(id=id).filter(cpf=cpf).exists():
            messages.error(request, 'O CPF já está cadastrado. Por favor, insira um CPF diferente.')
            return render(request, 'editar_colaborador.html', {'colaborador': colaborador})
        
        colaborador.cpf = cpf
        colaborador.data_nascimento = request.POST['data_nascimento']
        colaborador.lugar_onde_mora = request.POST['lugar_onde_mora']
        
        renda_str = request.POST['renda']
        # Normaliza a string de renda para um formato aceito pelo float
        renda_str = renda_str.replace(',', '.')  # Substitui vírgulas por pontos

        try:
            colaborador.renda = float(renda_str)  # Converter renda para float
        except ValueError:
            messages.error(request, 'Por favor, insira um valor de renda válido.')
            return render(request, 'editar_colaborador.html', {'colaborador': colaborador})

        colaborador.situacoes_de_vulnerabilidade = request.POST['situacoes_de_vulnerabilidade']
        colaborador.quantos_filhos = request.POST['quantos_filhos']
        colaborador.quantas_pessoas_moram_com_voce = request.POST['quantas_pessoas_moram_com_voce']
        colaborador.habilidades = request.POST['habilidades']

        # Salva as alterações no colaborador
        colaborador.save()
        messages.success(request, "Colaborador editado com sucesso!")
        return redirect('manguetown:gestao_colaboradores')

    return render(request, 'editar_colaborador.html', {'colaborador': colaborador})

@login_required
def editar_boneca_view(request, id):
     # Obtém a boneca com o ID fornecido ou retorna 404 caso não seja encontrada
    boneca = get_object_or_404(Boneca, id=id)

    if request.method == 'POST':
        # Aqui você pode manipular a lógica de atualização da boneca
        boneca.nome = request.POST['nome']
        boneca.nivel_dificuldade = request.POST['nivel_dificuldade']
        boneca.save()

        # Redireciona para a lista de bonecas ou qualquer outra página
        messages.success(request, "Boneca atualizada com sucesso!")
        return redirect('manguetown:gestao_bonecas')

    return render(request, 'editar_boneca.html', {'boneca': boneca})



from django.shortcuts import render
from django.db.models import Sum
from .models import Colaborador

""""
def relatorios_view(request):
    # Buscar todos os colaboradores com a soma da quantidade de bonecas que cada um tem nos trabalhos
    colaboradores = Colaborador.objects.annotate(total_bonecas=Sum('trabalho__quantidade'))

    dados_bonecas = []
    dados_desempenho = []

    for colaborador in colaboradores:
        # Dados para o gráfico de bonecas
        dados_bonecas.append({
            'nome': colaborador.nome,
            'total_bonecas': colaborador.total_bonecas or 0  # Garantir que mesmo sem trabalhos, o valor seja 0
        })
        
        # Calcular os pontos do colaborador com base no nível de dificuldade das bonecas nos trabalhos
        total_pontos = 0
        for trabalho in colaborador.trabalho_set.all():
            # Obtém a boneca associada ao trabalho
            boneca = trabalho.boneca

            if boneca.nivel_dificuldade == '1':
                total_pontos += trabalho.quantidade * 1  # Nível 1: 1 ponto por boneca
            elif boneca.nivel_dificuldade == '2':
                total_pontos += trabalho.quantidade * 1.5  # Nível 2: 1.5 pontos por boneca
            elif boneca.nivel_dificuldade == '3':
                total_pontos += trabalho.quantidade * 2  # Nível 3: 2 pontos por boneca
            # Adicione mais condições conforme os níveis de dificuldade

        # Dados para o gráfico de desempenho
        dados_desempenho.append({
            'nome': colaborador.nome,
            'pontos': total_pontos
        })
    
    # Passando os dados para o template
    return render(request, 'relatorios.html', {
        'dados_bonecas': dados_bonecas,
        'dados_desempenho': dados_desempenho
    })
"""
    
def dashboard_view(request):
    # Filtrando os trabalhos com data de previsão dentro dos próximos 7 dias
    data_limite = timezone.now() + timedelta(days=7)
    trabalhos = Trabalho.objects.filter(data_previsao__lte=data_limite, data_previsao__gte=timezone.now(), status = 'ativo').order_by('data_previsao')

    # Preparando os eventos para o FullCalendar
    eventos = []
    for trabalho in trabalhos:
        evento = {
            'title': f'{trabalho.boneca.nome} - {trabalho.quantidade} unidades',
            'start': trabalho.data_previsao.strftime('%Y-%m-%dT%H:%M:%S'),
            'end': (trabalho.data_previsao + timedelta(hours=1)).strftime('%Y-%m-%dT%H:%M:%S')  # Definindo um fim para o evento
        }
        eventos.append(evento)

    return render(request, 'dashboard.html', {
        'trabalhos': trabalhos,
        'eventos': eventos  # Passando os eventos para o template
    })
    
from django.db.models import Sum, F, Count

def relatorios_view(request):
    trabalhos_concluidos = Trabalho.objects.filter(status='concluido')

    # Dados para o gráfico de quantidade de bonecas por colaborador
    dados_bonecas = (
        Colaborador.objects.filter(
            trabalho__in=trabalhos_concluidos  # Filtra apenas os colaboradores com trabalhos concluídos
        )
        .annotate(
            quantidade_bonecas=Sum('trabalho__quantidade')  # Soma a quantidade de bonecas para cada colaborador
        )
        .values('nome', 'quantidade_bonecas')  # Ajusta para refletir a quantidade de bonecas
    )

    # Dados para o gráfico de desempenho por pontos
    dados_desempenho = (
        Colaborador.objects.filter(
            trabalho__in=trabalhos_concluidos  # Filtra apenas os colaboradores com trabalhos concluídos
        )
        .annotate(
            pontos=Sum(
                F('trabalho__quantidade') * F('trabalho__boneca__nivel_dificuldade')
            )
        )
        .values('nome', 'pontos')
    )
    
    # Passa os dados para o template
    context = {
        'dados_bonecas': dados_bonecas,
        'dados_desempenho': dados_desempenho,
    }
    return render(request, 'relatorios.html', context)