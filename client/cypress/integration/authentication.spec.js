const logIn = () => {
    const { username, password } = Cypress.env('credentials')
    cy.server()
    cy.route({
        method: 'POST',
        url: '**/api/log_in/**',
        status: 200,
        response: {
            'access': 'ACCESS_TOKEN',
            'refresh': 'REFRESH_TOKEN'
        }
    }).as('logIn');

    cy.visit('/#/log-in');
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, { log: false });
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
};

describe('Authentication', function () {
    it('Can log in.', function () {
        logIn();
        cy.hash().should('eq', '#/');
    });

    it('Can sign up.', function () {
        const { username, password } = Cypress.env('credentials')
        cy.visit('/#/sign-up');
        cy.get('input#username').type(username);
        cy.get('input#firstName').type('Mateusz');
        cy.get('input#lastName').type('Nowak');
        cy.get('input#password').type(password, { log: false });
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
    });

    it('Cannot visit the login page when logged in.', function () {
        logIn();
        cy.visit('/#/log-in');
        cy.hash().should('eq', '#/');
    });

    it('Cannot visit the sign up page when logged in.', function () {
        logIn();
        cy.visit('/#/sign-up');
        cy.hash().should('eq', '#/');
    });

    it('Cannot see links when logged in.', function () {
        logIn();
        cy.get('button#signUp').should('not.exist');
        cy.get('button#logIn').should('not.exist');
    });

    it('Shows an alert on login error', function () {
        const { username, password } = Cypress.env('credentials');

        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/log_in/**',
            status: 400,
            response: {
                '__all__': [
                    'Please enter a correct username and password. ' +
                    'Note that both fields may be case-sensitive.'
                ]
            }
        }).as('logIn');

        cy.visit('/#/log-in');
        cy.get('input#username').type(username);
        cy.get('input#password').type(password, { log: false });
        cy.get('button').contains('Log in').click();
        cy.wait('@logIn');
        cy.get('div.alert').contains(
            'Please enter a correct username and password. ' +
            'Note that both fields may be case-sensitive.'
        );
        cy.hash().should('eq', '#/log-in');
    });
});