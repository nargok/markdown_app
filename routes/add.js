var express = require('express');
var router = express.Router();

var markdown = require( "markdown" ).markdown;

var knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'mark_data.sqlite3'
  },
  useNullAsDefault: true
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
    return this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  if (req.session.login == null) {
    res.redirect('/login');
    return;
  }
  res.render('add', { title: 'Add' });
});

router.post('/', (req, res, next) => {
  var rex = {
    title: req.body.title,
    conent: req.body.content,
    user_id: req.session.login.id
  }
  new Markdata(rec).save().then((model) => {
    res.redirect('/');
  });
});

module.exports = router;