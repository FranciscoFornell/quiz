var models = require('../models/models.js');
var listaTemas = [['otro', 'Otro'],
				  ['humanidades', 'Humanidades'],
				  ['ocio', 'Ocio'],
				  ['ciencia', 'Ciencia'],
				  ['tecnologia', 'Tecnología']];

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
	var queryParams = { order: 'pregunta ASC', where: {} };

	if(req.query.search){
		searchLike = '%' + req.query.search.toLowerCase().replace(/[ ]+/g,'%')+ '%';
		//Compruebo si se está en entorno de desarrollo porque en SQLITE el like es
		//case insensitive. Si no se está en desarrollo y se está usando POSTGRES,
		//se usa ilike en lugar de like para que sea case insensitive. Si no se usara
		//este if, SQLITE no soporta ilike y fallaría.
		if (!process.env.NODE_ENV||process.env.NODE_ENV==='development'){
			queryParams.where.pregunta = {like: searchLike};	
		} else {
			queryParams.where.pregunta = {ilike: searchLike};
		}
	}
	if(req.query.temas){
		queryParams.where.tema = req.query.temas;
	}
	models.Quiz.findAll(queryParams).then(function(quizes) {
		res.render('quizes/index.ejs', {
			quizes: quizes,
			search: req.query.search,
			listaTemas: listaTemas,
			temasSelec: req.query.temas,
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
			pregunta: "",
			respuesta: ""
		}
	);

	res.render('quizes/new', {quiz: quiz, listaTemas: listaTemas, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz, previa validación
	quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/new', {
					quiz: quiz,
					listaTemas: listaTemas,
					errors: err.errors
				});
			} else {
				quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes');
				});	//Redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, listaTemas: listaTemas, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  	= req.body.quiz.pregunta;
	req.quiz.respuesta 	= req.body.quiz.respuesta;
	req.quiz.tema 		= req.body.quiz.tema;

// guarda en DB los campos pregunta y respuesta de quiz, previa validación
	req.quiz.validate().then(
		function(err){
			if (err) {
				res.render('quizes/edit', {
					quiz: req.quiz,
					listaTemas: listaTemas,
					errors: err.errors
				});
			} else {
				req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
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