describe('Cadastro, Edição e Remoção de Colaborador', () => {
    const cpf = '88099122190';  // CPF para verificar e excluir
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const amanhaStr = amanha.toISOString().split('T')[0];

    beforeEach(() => {
        // Realiza o login uma vez para economizar tempo nos testes
        cy.visit('/');
        cy.get('#username').type('admin');
        cy.get('#password').type('123123');
        cy.get('.login_btn').click();
    });
    
    it('Visualização se gráficos são atualizados na conclusão de novo trabalho', () => {
  
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
            if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
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
        if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
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
    cy.get('#nivel_dificuldade').type('2');

    // Envia o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se o redirecionamento ocorreu e voltou para a página de gestão
    cy.url().should('include', '/gestao_bonecas');

    // Verifica se o colaborador está na lista de colaboradores com o novo CPF
    cy.contains('CypressDoll').should('be.visible');
    cy.contains('2').should('be.visible');

    // Acessa a página de gestão de trabalho
    cy.visit('/gestao_trabalho');

    // Clica no botão "Cadastrar novo Trabalho"
    cy.contains('Cadastrar novo Trabalho').click();

    // Preenche o formulário com dados fictícios
    cy.get('#colaborador_id').select('CypressUser', { force: true });
    cy.get('#boneca_id').select('CypressDoll', { force: true }); 
    cy.get('#quantidade').type('123321');
    cy.get('#data_previsao').type(amanhaStr);
        
    // Envia o formulário
    cy.get('button[type="submit"]').click();

    // Conclui o trabalho criado
    cy.get('body').then((body) => {
        if (body.text().includes('CypressUser')) {
        // Se o nome
        cy.contains('CypressDoll')
            .parents('tr') // Encontra a linha da tabela
            .find('.action-select') // Encontra o dropdown de ações
            .select('concluir'); // Seleciona a ação "Concluir"
        }
      });

    // Acessa a página de relatórios
    cy.visit('/relatorios');

    // Clica no primeiro botão
    cy.get('button').contains('Quantidade de Bonecas por Colaborador').click();

    // Clica no primeiro botão
    cy.get('button').contains('Quantidade de Bonecas por Colaborador').click();

    // Clica no segundo botão
    cy.get('button').contains('Desempenho por Pontos').click();
    
    // Clica no segundo botão
    cy.get('button').contains('Desempenho por Pontos').click();

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
        if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
        return true; // Confirma a exclusão
      });
  
    // Verifica se o CPF foi excluído
    cy.contains(cpf).should('not.exist');

    // Verifica se o sistema exibe uma mensagem de confirmacao
    cy.contains('Colaborador excluído com sucesso!').should('be.visible'); // Ajuste a mensagem conforme o retorno do seu sistema

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
        if(text == 'Tem certeza de que deseja excluir este colaborador?' || text === 'Tem certeza de que deseja excluir esta boneca?')
        return true; // Confirma a exclusão
      });

      cy.contains('CypressDoll').should('not.exist');

      // Verifica se o sistema exibe uma mensagem de confirmacao
      cy.contains('Boneca excluída com sucesso!').should('be.visible');
    });
    
    });






});
