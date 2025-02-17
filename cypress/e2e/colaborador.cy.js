describe('Cadastro, Edição e Remoção de Colaborador', () => {
    const cpf = '99999999999';  // CPF para verificar e excluir
    
    beforeEach(() => {
        // Realiza o login uma vez para economizar tempo nos testes
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });
    
    it('Deve excluir colaborador com CPF existente e cadastrar um novo colaborador', () => {
  
      // Acessa a página de gestão de colaboradores
      cy.visit('/gestao_colaboradores');
    
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
            expect(text).to.contains('Tem certeza de que deseja excluir este colaborador?');
            return true; // Confirma a exclusão
        });
        
        // Verifica se o CPF foi excluído
        cy.contains(cpf).should('not.exist');
    }
    });
  
      // Clica no botão "Cadastrar novo Colaborador"
      cy.contains('Cadastrar novo Colaborador').click();
  
      // Verifica se a página de cadastro foi carregada
      cy.url().should('include', '/cadastrar_colaborador');
    
      // Preenche o formulário com dados fictícios
      cy.get('#nome').type('CypressUser');
      cy.get('#cpf').type(cpf); // Usa o novo CPF
      cy.get('#data_nascimento').type('1980-05-27');
      cy.get('#lugar_onde_mora').type('Casa Amarela');
      cy.get('#renda').type('1500.00');
      cy.get('#situacoes_de_vulnerabilidade').type('Nenhuma');
      cy.get('#quantos_filhos').type('2');
      cy.get('#quantas_pessoas_moram_com_voce').type('4');
      cy.get('#habilidades').type('Costura Intermediária');
    
      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_colaboradores');
    
      // Verifica se o colaborador está na lista de colaboradores com o novo CPF
      cy.contains('CypressUser').should('be.visible');
      cy.contains(cpf).should('be.visible');
      cy.contains('27 de Maio de 1980').should('be.visible');
      cy.contains('Casa Amarela').should('be.visible');
      cy.contains('1500,00').should('be.visible');
      cy.contains('Nenhuma').should('be.visible');
      cy.contains('2').should('be.visible');
      cy.contains('4').should('be.visible');
      cy.contains('Costura Intermediária').should('be.visible');
    });

    it('Deve impedir cadastro de colaborador com CPF já existente', () => {
        // Recarrega a página de gestão de colaboradores antes de tentar novo cadastro
        cy.visit('/gestao_colaboradores');

        // Tenta cadastrar o mesmo CPF novamente
        cy.contains('Cadastrar novo Colaborador').click();

        // Preenche o formulário com o CPF já cadastrado
        cy.get('#nome').type('Maria');
        cy.get('#cpf').type(cpf);
        cy.get('#data_nascimento').type('1990-08-21');
        cy.get('#lugar_onde_mora').type('Apipucos');
        cy.get('#renda').type('2500.00');
        cy.get('#situacoes_de_vulnerabilidade').type('Desempregada');
        cy.get('#quantos_filhos').type('1');
        cy.get('#quantas_pessoas_moram_com_voce').type('3');
        cy.get('#habilidades').type('Pintura');

        // Submete o formulário
        cy.get('button[type="submit"]').click();

        // Verifica se o sistema exibe uma mensagem de erro de CPF duplicado
        cy.contains('O CPF já está cadastrado. Por favor, insira um CPF diferente.').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    });

    it('Deve editar um Colaborador já existente', () => {
        // Recarrega a página de gestão de colaboradores antes de tentar novo cadastro
        cy.visit('/gestao_colaboradores');

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
      cy.url().should('include', '/editar_colaborador');

      // Edita o formulário com dados fictícios
      cy.get('#lugar_onde_mora').clear().type('Várzea');
      cy.get('#habilidades').clear().type('Costura Avançada');

      // Envia o formulário
      cy.get('button[type="submit"]').click();
    
      // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
      cy.url().should('include', '/gestao_colaboradores');

      // Verifica se o colaborador está na lista de colaboradores com os novos elementos
      cy.contains('CypressUser').should('be.visible');
      cy.contains(cpf).should('be.visible');
      cy.contains('27 de Maio de 1980').should('be.visible');
      cy.contains('Várzea').should('be.visible');
      cy.contains('1500,00').should('be.visible');
      cy.contains('Nenhuma').should('be.visible');
      cy.contains('2').should('be.visible');
      cy.contains('4').should('be.visible');
      cy.contains('Costura Avançada').should('be.visible');

      // Verifica se o sistema exibe uma mensagem de confirmacao
      cy.contains('Colaborador editado com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
    
      
    });

    it('Deve excluir um Colaborador', () => {
      // Recarrega a página de gestão de colaboradores antes de tentar novo cadastro
      cy.visit('/gestao_colaboradores');

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
        expect(text).to.contains('Tem certeza de que deseja excluir este colaborador?');
        return true; // Confirma a exclusão
      });
    
      // Verifica se o CPF foi excluído
      cy.contains(cpf).should('not.exist');

    // Verifica se o sistema exibe uma mensagem de confirmacao
    cy.contains('Colaborador excluído com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema
  
  });
  });
  