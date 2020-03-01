const logIn = () => {
    const {username, password} = Cypress.env('credentials')
    cy.server()
    cy.route({
        method: 'POST',
        url: '**/api/log_in/**',
        // status: 200,
        // response: {
        //     'access': 'ACCESS_TOKEN',
        //     'refresh': 'REFRESH_TOKEN'
        // }
    }).as('logIn');

    cy.visit('/#/log-in');
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, {log: false});
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
};

describe('Authentication', function () {
    it('Can sign up.', function () {
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/sign_up/**',
            // status: 201,
            // response: {
            //     'id': 1,
            //     'username': 'user-test',
            //     'first_name': 'user-firstname',
            //     'last_name': 'user-lastname',
            //     'group': 'driver',
            //     'photo': '/media/images/photo.jpg'
            // }
        }).as('signUp');

        cy.visit('/#/sign-up');
        cy.get('input#username').type('mateusz');
        cy.get('input#firstName').type('Mateusz');
        cy.get('input#lastName').type('Kowalski');
        cy.get('input#password').type('passWORD', {log: false});
        cy.get('select#group').select('driver');

        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').upload({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });
        cy.get('button').contains('Sign up').click();
        cy.wait('@signUp');
        cy.hash().should('eq', '#/log-in');
    });

    it('Show invalid fields on sign up error.', function () {
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/sign_up/**',
            // status: 400,
            // response: {
            //     'username': [
            //         'A user with that username already exists.'
            //     ],
            //     'lastName': [
            //         'An invalid lastName.'
            //     ]
            // }
        }).as('signUp');

        cy.visit('/#/sign-up');
        cy.get('input#username').type('mateusz');
        cy.get('input#firstName').type('user-firstname');
        cy.get('input#lastName').type('user-lastname');
        cy.get('input#password').type('PASSWORD2', {log: false});
        cy.get('select#group').select('driver');

        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').upload({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });
        cy.get('button').contains('Sign up').click();
        cy.wait('@signUp');
        cy.get('div.invalid-feedback').contains(
            'A user with that username already exists.'
        );
        cy.hash().should('eq', '#/sign-up');
    });


    it('Can log in.', function () {
        logIn();
        cy.hash().should('eq', '#/');
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
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/log_in/**',
            // status: 400,
            // response: {
            //     '__all__': [
            //         'Please enter a correct username and password. ' +
            //         'Note that both fields may be case-sensitive.'
            //     ]
            // }
        }).as('logIn');

        cy.visit('/#/log-in');
        cy.get('input#username').type('zlylogin');
        cy.get('input#password').type('passwd', {log: false});
        cy.get('button').contains('Log in').click();
        cy.wait('@logIn');
        cy.get('div.alert').contains(
            'No active account found with the given credentials'
        );
        cy.hash().should('eq', '#/log-in');
    });

    it('Can log out.', function () {
        logIn();
        cy.get('button').contains('Log out').click().should(() => {
            expect(window.localStorage.getItem('taxi.auth')).to.be.null;
        });
        cy.get('button').contains('Log out').should('not.exist');
    });
});