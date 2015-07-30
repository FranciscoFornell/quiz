var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statsData = {};

exports.obtainData = function(req, res, next) {
//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
//de esta forma se ejecutan las consultas asíncronamente en paralelo y se
//continúa cuando han acabado todas.
	Sequelize.Promise.all([
		models.Quiz.count(),
		models.Comment.count(),
//Se ha añadido nuevos métodos al modelo Comment en models/comment.js
//Para ello se han seguido las instucciones de la documentación de sequelize:
//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
		models.Comment.countDistinctQuizId(),
		models.Comment.countPublished()
	]).then( function( values ){
		statsData.quizes=values[0];
		statsData.comments=values[1];
		statsData.commentedQuizes=values[2];
		statsData.publishedComments=values[3];
	}).catch( function (err) {
		next(err);
	}).finally( function() {
		next();
	});
};

// GET /quizes/statistics
exports.show = function(req, res) {
	res.render('statistics', {
		statsData: statsData,
		errors: []
	});
};