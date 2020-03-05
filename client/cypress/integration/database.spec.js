describe('The database client', function () {
    before(function () {
        cy.task('tableTruncate', {
            table: 'trips_user'
        }).then((users) => {
            cy.wrap(users).should('have.length', 0);
        });
    });
    it(' can insert into a table', function () {
        cy.fixture('data/users.json').then((users) => {
            cy.task('tableInsert', {
                table: 'trips_user', rows: users
            }).then((ids) => {
                cy.wrap(ids).should('have.length', 1);
            });
        });
    });
    it('can read data from a table', function () {
        cy.task('tableSelect', {
            table: 'trips_user'
        }).then((users) => {
            cy.wrap(users).should('have.length', 1);
        });
    });
});