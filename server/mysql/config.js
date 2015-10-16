var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'crptfit',
    charset  : 'utf8'
  }
});

module.exports = db = require('bookshelf')(knex);
