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
			search: req.query.search,
			errors: []
		});
	}).catch(function(error){
		next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {
		quiz: req.quiz,
		respuesta: resultado,
		errors: []
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{
			pregunta: "Pregunta",
			respuesta: "Respuesta"
		}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz, previa validación
	quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
					res.redirect('/quizes');
				});	//Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

// guarda en DB los campos pregunta y respuesta de quiz, previa validación
	req.quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
					res.redirect('/quizes');
				});	//Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){
		next(error);
	});
};