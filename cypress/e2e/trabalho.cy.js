describe('Gestão de Trabalho - Cadastro com criação de Boneca e Colaborador', () => {
    const bonecaNome = 'CypressDoll';
    const bonecaDificuldade = 4;

    const colaboradorNome = 'CypressUser';
    const colaboradorCPF = '99999999999';

    const trabalhoQuantidade = 10;
    const trabalhoDataPrevisao = '8024-12-01'; // Aqui você pode manter a data no formato ISO (ano-mês-dia)

    beforeEach(() => {
        // Realiza o login
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });

    it('Deve criar uma boneca, um colaborador e cadastrar um novo trabalho', () => {
        // Passo 1: Criação de Boneca
        cy.visit('/gestao_bonecas');
        cy.get('body').then((body) => {
            if (body.text().includes(bonecaNome)) {
                // Se a boneca já existe, exclui para garantir o estado inicial
                cy.contains(bonecaNome)
                    .parents('tr')
                    .find('.action-select')
                    .select('excluir');
                cy.on('window:confirm', () => true); // Confirma a exclusão
                cy.contains(bonecaNome).should('not.exist');
            }
        });

        cy.contains('Cadastrar nova Boneca').click();
        cy.url().should('include', '/cadastrar_boneca');
        cy.get('#nome_boneca').type(bonecaNome);
        cy.get('#nivel_dificuldade').type(bonecaDificuldade.toString());
        cy.get('button[type="submit"]').click();
        cy.contains(bonecaNome).should('be.visible');

        // Passo 2: Criação de Colaborador
        cy.visit('/gestao_colaboradores');
        cy.get('body').then((body) => {
            if (body.text().includes(colaboradorCPF)) {
                // Se o colaborador já existe, exclui para garantir o estado inicial
                cy.contains(colaboradorCPF)
                    .parents('tr')
                    .find('.action-select')
                    .select('excluir');
                cy.on('window:confirm', () => true); // Confirma a exclusão
                cy.contains(colaboradorCPF).should('not.exist');
            }
        });

        cy.contains('Cadastrar novo Colaborador').click();
        cy.url().should('include', '/cadastrar_colaborador');
        cy.get('#nome').type(colaboradorNome);
        cy.get('#cpf').type(colaboradorCPF);
        cy.get('#data_nascimento').type('1980-05-27');
        cy.get('#lugar_onde_mora').type('Casa Amarela');
        cy.get('#renda').type('1500.00');
        cy.get('#situacoes_de_vulnerabilidade').type('Nenhuma');
        cy.get('#quantos_filhos').type('2');
        cy.get('#quantas_pessoas_moram_com_voce').type('4');
        cy.get('#habilidades').type('Costura Intermediária');
        cy.get('button[type="submit"]').click();
        cy.contains(colaboradorNome).should('be.visible');
        cy.contains(colaboradorCPF).should('be.visible');

        // Passo 3: Cadastro de Trabalho
        cy.visit('/gestao_trabalho/');
        cy.contains('Cadastrar novo Trabalho').click();
        cy.url().should('include', '/cadastrar_trabalho');

        // Preencher o formulário de cadastro de trabalho
        cy.get('#boneca_id').select(bonecaNome); // Seleciona a boneca criada
        cy.get('#colaborador_id').select(colaboradorNome, { force: true }); // Seleciona o colaborador criado, ignorando a sobreposição
        cy.get('#quantidade').type(trabalhoQuantidade.toString()); // Preenche a quantidade
        cy.get('#data_previsao').type(trabalhoDataPrevisao); // Preenche a data de previsão
        cy.get('button[type="submit"]').click(); // Submete o formulário

        // Verificar se o trabalho foi cadastrado corretamente
        cy.url().should('include', '/gestao_trabalho'); // Verifica se voltamos para a página de gestão de trabalho
        cy.contains(bonecaNome).should('be.visible'); // Verifica se o nome da boneca aparece
        cy.contains(colaboradorNome).should('be.visible'); // Verifica se o nome do colaborador aparece
        cy.contains(trabalhoQuantidade).should('be.visible'); // Verifica se a quantidade aparece
        
        // Formatar a data no formato esperado (Ex: '30 de Novembro de 2024')
        const formattedDate = '1 de Dezembro de 8024';
        cy.contains(formattedDate).should('be.visible'); // Verifica se a data prevista aparece

        // Verificar o status, que é gerado automaticamente pelo backend
        // O status será "Ativo" se a data de previsão for no futuro, ou "Expirado" se a data de previsão já passou
        cy.contains('Ativo').should('be.visible'); // Verifica se o status 'Ativo' aparece
    });

    it('Deve editar um trabalho existente', () => {
        // Passo 1: Criação do Trabalho
        cy.visit('/gestao_trabalho');
        // Passo 2: Selecionar a ação para a colaboradora CypressUser
        cy.contains(colaboradorNome) // Encontrar a linha da colaboradora CypressUser
            .parents('tr') // Encontrar o <tr> que contém o nome da colaboradora
            .find('.action-select') // Localiza o select de ações
            .select('editar') // Seleciona a opção 'editar'

        // Passo 3: Verificar se a URL foi redirecionada para a página de edição
        cy.url().should('include', '/editar_trabalho');

        cy.get('#quantidade').clear().type('9999'); // Preenche a quantidade
        cy.get('#data_previsao').clear().type('8024-01-01');
        cy.get('button[type="submit"]').click(); // Submete o formulário

        cy.contains('9999').should('be.visible'); 
        cy.contains('1 de Janeiro de 8024').should('be.visible'); 


    });

    it('Deve excluir um trabalho existente', () => {
        // Passo 1: Criação do Trabalho
        cy.visit('/gestao_trabalho');
        // Passo 2: Selecionar a ação para a colaboradora CypressUser
        cy.contains(colaboradorNome) // Encontrar a linha da colaboradora CypressUser
            .parents('tr') // Encontrar o <tr> que contém o nome da colaboradora
            .find('.action-select') // Localiza o select de ações
            .select('excluir') // Seleciona a opção 'editar'

            cy.on('window:confirm', (text) => {
                if(text == 'Tem certeza de que deseja excluir este trabalho?')
                return true; // Confirma a exclusão
              });

        cy.contains(bonecaNome).should('not.exist'); 
        cy.contains(colaboradorNome).should('not.exist');
        cy.contains('9999').should('not.exist'); 
        cy.contains('1 de Janeiro de 8024').should('not.exist'); 

        cy.visit('/gestao_colaboradores');

        // Verifica a presença do CPF no corpo da página
        cy.get('body').then((body) => {
            if (body.text().includes(colaboradorCPF)) {
            // Se o CPF existir, realiza a edição
            cy.contains(colaboradorCPF)
                .parents('tr') // Encontra a linha da tabela
                .find('.action-select') // Encontra o dropdown de ações
                .select('excluir'); // Seleciona a ação "Excluir"

            }
        });

        // Confirma o alerta de exclusão
        // Confirma o alerta de exclusão
        cy.on('window:confirm', (text) => {
            if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
            return true; // Confirma a exclusão
          });
        // Verifica se o CPF foi excluído
        cy.contains(colaboradorCPF).should('not.exist');


        cy.visit('/gestao_bonecas');

      // Verifica a presença do CPF no corpo da página
      cy.get('body').then((body) => {
        if (body.text().includes('CypressDoll')) {
        // Se o CPF existir, realiza a edição
        cy.contains('CypressDoll')
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"

        }

        // Confirma o alerta de exclusão
        cy.on('window:confirm', (text) => {
            if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
            return true; // Confirma a exclusão
          });

        cy.contains('CypressDoll').should('not.exist');

        // Verifica se o sistema exibe uma mensagem de confirmacao
        cy.contains('Boneca excluída com sucesso!').should('be.visible');




        });

    });
});


