var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId)
		},
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('No existe ningún comentario con commentId=' + commentId));
		}
	}).catch(function(error){
		next(error);
	});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});

// guarda en DB el comentario, previa validación
	comment.validate().then(
		function(err){
			if (err) {
				res.render('comments/new', {
					comment: comment,
					quizid: req.params.quizId,
					errors: err.errors
				});
			} else {
				comment.save().then(function(){
					res.redirect('/quizes/'+req.params.quizId);
				});	//Redirección HTTP (URL relativo) a la pregunta
			}
		}
	).catch(function(error){
		next(error);
	});
};

// PUT /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
		.then(function(){ res.redirect('/quizes/'+req.params.quizId);} )
		.catch(function(error){next(error);});
};

// DELETE /quizes/:quizId/comments/:commentId
exports.destroy = function(req, res) {
	var quizId = req.comment.QuizId;
	req.comment.destroy().then( function() {
		res.redirect('/quizes/'+quizId);
	}).catch(function(error){
		next(error);
	});
};