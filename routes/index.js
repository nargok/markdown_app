var express = require('express');
var router = express.Router();

var markdown = require( "markdown" ).markdown;

var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mark_data.sqlite3'
  }
});

var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

var User = Bookshelf.Model.extend({
  tableName: 'users'
});

var Markdata = Bookshelf.Model.extend({
  tableName: 'markdata',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo(User)
  }
});

router.get('/', function(req, res, next) {
  if (req.session.login == nul) {
    res.redirect('/login');
    return;
  }
  new Markdata(['title']).orderBy('created_at', 'DESC')
    .fetchPage({page: 1, pageSize: 10, withRelated: ['user']})
    .then((collection) => {
      var data = {
        title: 'Marddown Search',
        login: req.session.login,
        message: '※最近の投稿データ',
        form: {find: ''},
        content: collection.toArray()
      };
      res.render('index', data);
    });
});

router.post('/', (req, res, next) => {
  new Markdata().orderBy('created_at', 'DESC')
    .where('content', 'like', '%' + req.body.find + '%')
    .fetchAll({withRelated: ['user']})
    .then((collection) => {
      var data = {
        title: 'Markdown Search',
        login: req.session.login,
        message: '※"' + req.body.find + '" で検索された最近の投稿データ',
        form: req.body,
        content: collection.toArray()
      };
      res.render('index', data);
    });
});

module.exports = router;