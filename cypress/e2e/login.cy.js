describe('Teste de Login', () => {
  it('Realiza login com credenciais válidas', () => {
      cy.visit('/');
      cy.get('#username').type('admin');
      cy.get('#password').type('123123');
      cy.get('.login_btn').click();
      cy.url().should('include', '/dashboard');
  });
});
