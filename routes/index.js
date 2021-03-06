var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statsController = require('../controllers/stats_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: [] });
});

// Autoload de comandos
router.param('quizId', quizController.load); // Autoload :quizId
router.param('commentId', commentController.load); // Autoload :commentId

// Definición de rutas de sesión
router.get('/login',						sessionController.new);     // formulario login
router.post('/login',						sessionController.create);  // crear sesión
router.get('/logout',						sessionController.destroy); // destruir sesión

// Definición de rutas de /quizes
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create',				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.destroy);
router.get('/quizes/statistics',			statsController.obtainData, statsController.show);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
	sessionController.loginRequired,
	commentController.publish);
router.delete('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)',
	sessionController.loginRequired,
	commentController.destroy);

router.get('/author', function(req, res){
	res.render('author', {
		authorName: 'Francisco Fornell Vázquez',
		image: 'images/author.jpg',
		errors: []
	});
});

module.exports = router;
