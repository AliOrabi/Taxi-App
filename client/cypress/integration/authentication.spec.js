describe('Authentication', function () {
    it('Can log in.', function () {
        cy.visit('/#/log-in');
        cy.get('input#username').type('mateusz');
        cy.get('input#password').type('passwORD', { log: false });
        cy.get('button').contains('Log in').click();
        cy.hash().should('eq', '#/');
    })

    it('Can sign up.', function () {
        cy.visit('/#/sign-up');
        cy.get('input#username').type('mati');
        cy.get('input#firstName').type('Mateusz');
        cy.get('input#lastName').type('Nowak');
        cy.get('input#password').type('passWORD', { log: false });
        cy.get('select#group').select('driver');

        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').upload({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });
        cy.get('button').contains('Sign up').click();
        cy.hash().should('eq', '#/log-in');
    })
})