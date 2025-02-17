describe('Cadastro, Edição e Remoção de doador', () => {
    const cpf = '99999999999';  // CPF para verificar e excluir
    
    beforeEach(() => {
        // Realiza o login uma vez para economizar tempo nos testes
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });
    
    it('Deve excluir Doador com CPF existente e cadastrar um novo doador', () => {
  
      // Acessa a página de gestão de Doadores
      cy.visit('/gestao_doadores');
    
        // Verifica a presença do CPF no corpo da página
        cy.get('body').then((body) => {
        if (body.text().includes(cpf)) {
        // Se o CPF existir, realiza a exclusão
        cy.contains(cpf)
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"
        
        // Confirma o alerta de exclusão
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Tem certeza de que deseja excluir este doador?');
            return true; // Confirma a exclusão
        });
        
        // Verifica se o CPF foi excluído
        cy.contains(cpf).should('not.exist');
    }
    });
  
      // Clica no botão "Cadastrar novo Doador"
      cy.contains('Cadastrar novo Doador').click();
  
      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/cadastrar_doador');
    
      // Preenche o formulário com dados fictícios
      cy.get('#nome').type('CypressUser');
      cy.get('#cpf').type(cpf); // Usa o novo CPF
      cy.get('#data_nascimento').type('1980-05-27');
      cy.get('#lugar_onde_mora').type('Casa Amarela');
      cy.get('#individual').select('False');
      cy.get('#tipo_doador').select('Resíduo');
      cy.get('#data_disponibilidade').type('2050-12-12');
      cy.get('#local_captacao').type('Santo Amaro');
      cy.get('#condicao_residuo').type('Ótimo');
      cy.get('#tipo_residuo').type('Tecido');
    
      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_doadores');
    
      // Verifica se o Doador está na lista de Doadores com o novo CPF
      cy.contains('CypressUser').should('be.visible');
      cy.contains(cpf).should('be.visible'); // Usa o novo CPF
      cy.contains('27 de Maio de 1980').should('be.visible');
      cy.contains('Casa Amarela').should('be.visible');
      cy.contains('Não').should('be.visible');
      cy.contains('Resíduo').should('be.visible');
      cy.contains('12 de Dezembro de 2050').should('be.visible');
      cy.contains('Santo Amaro').should('be.visible');
      cy.contains('Ótimo').should('be.visible');
      cy.contains('Tecido').should('be.visible');
    });

    it('Deve impedir cadastro de doador com CPF já existente', () => {
        // Recarrega a página de gestão de Doadores antes de tentar novo cadastro
        cy.visit('/gestao_doadores');

        // Tenta cadastrar o mesmo CPF novamente
        cy.contains('Cadastrar novo Doador').click();

        // Preenche o formulário com o CPF já cadastrado
        cy.get('#nome').type('CypressUser');
        cy.get('#cpf').type(cpf); // Usa o novo CPF
        cy.get('#data_nascimento').type('1980-05-27');
        cy.get('#lugar_onde_mora').type('Casa Amarela');
        cy.get('#individual').select('False');
        cy.get('#tipo_doador').select('Resíduo');
        cy.get('#data_disponibilidade').type('2050-12-12');
        cy.get('#local_captacao').type('Santo Amaro');
        cy.get('#condicao_residuo').type('Ótimo');
        cy.get('#tipo_residuo').type('Tecido');

        // Submete o formulário
        cy.get('button[type="submit"]').click();

        // Verifica se o sistema exibe uma mensagem de erro de CPF duplicado
        cy.contains('O CPF já está cadastrado. Por favor, insira um CPF diferente.').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    });

    it('Deve editar um doador já existente', () => {
        // Recarrega a página de gestão de Doadores antes de tentar novo cadastro
        cy.visit('/gestao_doadores');

        // Verifica a presença do CPF no corpo da página
        cy.get('body').then((body) => {
          if (body.text().includes(cpf)) {
          // Se o CPF existir, realiza a edição
          cy.contains(cpf)
              .parents('tr') // Encontra a linha da tabela
              .find('.action-select') // Encontra o dropdown de ações
              .select('editar'); // Seleciona a ação "Editar"

          }
        });

      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/editar_doador');

      // Edita o formulário com dados fictícios
      cy.get('#individual').select('True')
      cy.get('#condicao_residuo').type('Mediano');

      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_doadores');

      // Verifica se o Doador está na lista de Doadores com os novos elementos
      cy.contains('CypressUser').should('be.visible');
      cy.contains(cpf).should('be.visible'); // Usa o novo CPF
      cy.contains('27 de Maio de 1980').should('be.visible');
      cy.contains('Casa Amarela').should('be.visible');
      cy.contains('Sim').should('be.visible');
      cy.contains('Resíduo').should('be.visible');
      cy.contains('12 de Dezembro de 2050').should('be.visible');
      cy.contains('Santo Amaro').should('be.visible');
      cy.contains('Mediano').should('be.visible');
      cy.contains('Tecido').should('be.visible');

      // Verifica se o sistema exibe uma mensagem de confirmacao
      cy.contains('Doador editado com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    
      
    });

    it('Deve excluir um doador', () => {
      // Recarrega a página de gestão de Doadores antes de tentar novo cadastro
      cy.visit('/gestao_doadores');

      // Verifica a presença do CPF no corpo da página
      cy.get('body').then((body) => {
        if (body.text().includes(cpf)) {
        // Se o CPF existir, realiza a edição
        cy.contains(cpf)
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('excluir'); // Seleciona a ação "Excluir"

        }
      });

      // Confirma o alerta de exclusão
      cy.on('window:confirm', (text) => {
        expect(text).to.contains('Tem certeza de que deseja excluir este doador?');
        return true; // Confirma a exclusão
      });
    
      // Verifica se o CPF foi excluído
      cy.contains(cpf).should('not.exist');

    // Verifica se o sistema exibe uma mensagem de confirmacao
    cy.contains('Doador excluído com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
  
  });
    it('Deve impedir usuario de inserir informações exclusivas de usuário não-financiador', () => {
        // Recarrega a página de gestão de Doadores antes de tentar novo cadastro
        cy.visit('/gestao_doadores');
    
        // Tenta cadastrar o mesmo CPF novamente
        cy.contains('Cadastrar novo Doador').click();
    
        // Preenche o formulário com o CPF já cadastrado
        cy.get('#nome').type('CypressUser');
        cy.get('#cpf').type(cpf); // Usa o novo CPF
        cy.get('#data_nascimento').type('1980-05-27');
        cy.get('#lugar_onde_mora').type('Casa Amarela');
        cy.get('#individual').select('False');
        cy.get('#tipo_doador').select('Financiador');
        // Verifica se o sistema exibe uma mensagem de bloqueio de input
        cy.contains('Atenção: Se "Financiador", campos abaixo desabilitados.').should('be.visible');

        cy.get('#data_disponibilidade').should('be.disabled');
        cy.get('#local_captacao').should('be.disabled');
        cy.get('#condicao_residuo').should('be.disabled');
        cy.get('#tipo_residuo').should('be.disabled');
    
        // Submete o formulário
        cy.get('#btn_cancelar').click();
    
        // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
        cy.url().should('include', '/gestao_doadores');
        });
  
    });
  