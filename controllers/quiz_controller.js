var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe ninguna pregunta con quizId=' + quizId));
		}
	});
};

// Get /quizes
exports.index = function(req, res) {
	var searchLike = '%';
	var queryParams = { order: 'pregunta ASC'};

	if(req.query.search){
		searchLike = '%' + req.query.search.toLowerCase().replace(/[ ]+/g,'%')+ '%';
		queryParams.where = ["lower(pregunta) like ?", searchLike];
	}
	models.Quiz.findAll(queryParams).then(function(quizes) {
		res.render('quizes/index.ejs', {
			quizes: quizes,
			search: req.query.search
		});
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado
	});
};