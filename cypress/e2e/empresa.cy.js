describe('Cadastro, Edição e Remoção de Empresa', () => {
    const cpf = '88099122190';  // CPF para verificar e excluir
    
    beforeEach(() => {
        // Realiza o login uma vez para economizar tempo nos testes
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });

    it('Deve cadastrar uma nova empresa e verificar se foi adicionada', () => {
  
      // Acessa a página de gestão de empresas
      cy.visit('/gestao_empresas');
    
      // Verifica a presença dos elementos que serão cadastrados no corpo da página
      cy.get('body').then((body) => {
        if (body.text().includes('Francisco@TstCypress' && 'Tecidos Cypress' && ('Cypressland' || 'New Cypressland') )) {
        // Se o CPF existir, realiza a exclusão
        cy.contains('Francisco@TstCypress' && 'Tecidos Cypress' && ('Cypressland' || 'New Cypressland'))
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"
        
        // Confirma o alerta de exclusão
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Tem certeza de que deseja excluir esta empresa?');
            return true; // Confirma a exclusão
        });
        
        // Verifica se os elementos foi excluído
        cy.contains('Francisco@TstCypress' && 'Tecidos Cypress' && ('Cypressland' || 'New Cypressland')).should('not.exist');
    }
    });

      
      // Clica no botão "Cadastrar nova empresa"
      cy.contains('Cadastrar nova Empresa').click();
  
      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/cadastro_empresa');
    
      // Preenche o formulário com dados fictícios
      cy.get('#nome_responsavel').type('Francisco@TstCypress');
      cy.get('#nome_empresa').type('Tecidos Cypress'); // Usa o novo CPF
      cy.get('#captacao_local').type('Cypressland');
      cy.get('#disponibilidade_residuo').type('A Combinar');
      cy.get('#porte_fabrico').type('Médio');
      cy.get('#tipo_residuo').type('Tecido');
      cy.get('#condicao_residuo').type('Excelente');
    
      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_empresas');
    
      // Verifica se a empresa cadastrada está na lista de empresas 
      cy.contains('Francisco@TstCypress').should('be.visible');
      cy.contains('Tecidos Cypress').should('be.visible');
      cy.contains('Cypressland').should('be.visible');
      cy.contains('A Combinar').should('be.visible');
      cy.contains('medio').should('be.visible');
      cy.contains('Tecido').should('be.visible');
      cy.contains('Excelente').should('be.visible');
    });

    it('Deve editar uma empresa já existente', () => {
        // Recarrega a página de gestão de empresas antes de tentar novo cadastro
        cy.visit('/gestao_empresas');

        // Verifica a presença de informações
        cy.get('body').then((body) => {
          if (body.text().includes('Francisco@TstCypress' && 'Tecidos Cypress' && 'Cypressland')) {
          // Se as informações existirem
          cy.contains('Francisco@TstCypress' && 'Tecidos Cypress' && 'Cypressland')
              .parents('tr') // Encontra a linha da tabela
              .find('.action-select') // Encontra o dropdown de ações
              .select('editar'); // Seleciona a ação "Editar"

          }
        });

      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/editar_empresa');

      // Edita o formulário com dados fictícios
      cy.get('#captacao_local').clear().type('New Cypressland');
      cy.get('#condicao_residuo').clear().type('Desgastado');

      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_empresas');

      // Verifica se a empresa cadastrada está na lista de empresas com os novos elementos
      cy.contains('Francisco').should('be.visible');
      cy.contains('Tecidos Cypress').should('be.visible');
      cy.contains('New Cypressland').should('be.visible');
      cy.contains('A Combinar').should('be.visible');
      cy.contains('medio').should('be.visible');
      cy.contains('Tecido').should('be.visible');
      cy.contains('Desgastado').should('be.visible');

      // Verifica se o sistema exibe uma mensagem de confirmacao
      cy.contains('Empresa atualizada com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    
      
    });

    it('Deve excluir uma Empresa', () => {
      // Recarrega a página de gestão de empresas antes de tentar novo cadastro
      cy.visit('/gestao_empresas');

      // Verifica a presença do elemento cadastrado
      cy.get('body').then((body) => {
        if (body.text().includes('Francisco@TstCypress' && 'Tecidos Cypress' && 'New Cypressland')) {
        // Se os elementos existirem, realiza exclusão
        cy.contains('Francisco@TstCypress' && 'Tecidos Cypress' && 'New Cypressland')
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"

        }
      });

      // Confirma o alerta de exclusão
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('Tem certeza de que deseja excluir esta empresa?');
        return true; // Confirma a exclusão
      });
    
      // Verifica se o elemento
      cy.contains('Francisco@TstCypress' && 'Tecidos Cypress' && 'New Cypressland').should('not.exist');

    // Verifica se o sistema exibe uma mensagem de confirmacao
    cy.contains('Empresa excluída com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
  
  });
  });
  