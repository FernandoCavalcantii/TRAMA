describe('Cadastro, alocação e Remoção de Boneca', () => {
    const cpf = '88099122199';  // CPF para verificar e excluir
    
    beforeEach(() => {
        // Realiza o login uma vez para economizar tempo nos testes
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });
    
    it('Deve Cadastrar uma nova boneca', () => {

      // Acessa a página de gestão de bonecas
      cy.visit('/gestao_bonecas');

      // Verifica a presença do nome da boneca no corpo da página
      cy.get('body').then((body) => {
        if (body.text().includes('CypressDoll')) {
        // Se o nome
        cy.contains('CypressDoll')
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"
        
        // Confirma o alerta de exclusão
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Tem certeza de que deseja excluir esta boneca?');
            return true; // Confirma a exclusão
        });
        
        // Verifica se o CPF foi excluído
        cy.contains('CypressDoll').should('not.exist');
    }
    });
      
      // Clica no botão "Cadastrar nova Boneca"
      cy.contains('Cadastrar nova Boneca').click();
  
      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/cadastrar_boneca');

      cy.get('#nome_boneca').type('CypressDoll');
      cy.get('#nivel_dificuldade').type('4');

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_bonecas');

      // Verifica se o colaborador está na lista de colaboradores com o novo CPF
      cy.contains('CypressDoll').should('be.visible');
      cy.contains('4').should('be.visible');
    });

    it('Deve editar uma boneca já existente', () => {
        // Recarrega a página de gestão de bonecas antes de tentar novo cadastro
        cy.visit('/gestao_bonecas');

        // Verifica a presença de informações
        cy.get('body').then((body) => {
          if (body.text().includes('CypressDoll')) {
          // Se as informações existirem
          cy.contains('CypressDoll')
              .parents('tr') // Encontra a linha da tabela
              .find('.action-select') // Encontra o dropdown de ações
              .select('editar'); // Seleciona a ação "Editar"

          }
        });

      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/editar_boneca');

      // Edita o formulário com dados fictícios
      cy.get('#nivel_dificuldade').clear().type('2');

      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_bonecas');

      // Verifica se a boneca cadastrada está na lista de bonecas com os novos elementos
      cy.contains('CypressDoll').should('be.visible');
      cy.contains('2').should('be.visible');


      // Verifica se o sistema exibe uma mensagem de confirmacao
      cy.contains('Boneca atualizada com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    
      
    });

    it('Deve excluir uma boneca', () => {
        // Acessa a página de gestão de bonecas
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
            expect(text).to.contains('Tem certeza de que deseja excluir esta boneca?');
            return true; // Confirma a exclusão
        })

        cy.contains('CypressDoll').should('not.exist');

        // Verifica se o sistema exibe uma mensagem de confirmacao
        cy.contains('Boneca excluída com sucesso!').should('be.visible');
      });
    });

  });
  