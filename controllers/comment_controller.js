var models = require('../models/models.js');

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