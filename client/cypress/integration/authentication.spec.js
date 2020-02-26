describe('Authentication', function() {
    it('Can log in.', function() {
        cy.visit('/#/log-in');
        cy.get('input#username').type('mateusz');
        cy.get('input#password').type('passwORD', {log: false});
        cy.get('button').contains('Log in').click();
        cy.hash().should('eq', '#/');
    })
})