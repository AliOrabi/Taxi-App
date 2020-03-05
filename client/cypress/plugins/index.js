const knex = require('knex');

module.exports = (on, config) => {
  on('task', {
    async tableTruncate({table}) {
      const client = await knex({
        client: 'pg',
        connection: config.env.database
      });
      await client.raw(`TRUNCATE ${table} RESTART IDENTITY CASCADE`);
      return client.select().table(table)
    },
    async tableInsert({ table, rows }) {
      const client = await knex({
        client: 'pg',
        connection: config.env.database
      });
      return client.insert(rows, ['id']).into(table);
    },
    async tableSelect({table}) {
      const client = await knex({
        client: 'pg',
        connection: config.env.database
      });
      return client.select().table(table);
    }
  });
};