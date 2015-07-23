var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite 	DATABASE_URL = sqlite://:@:/
var dbURL = process.env.DATABASE_URL||"sqlite://:@:/";
var url = dbURL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user	 = (url[2]||null);
var pwd 	 = (url[3]||null);
var protocol = (url[1]||null);
var dialect	 = (url[1]||null);
var port	 = (url[5]||null);
var host	 = (url[4]||null);
var storage	 = process.env.DATABASE_STORAGE||"quiz.sqlite";

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres:
var sequelize = new Sequelize(DB_name, user, pwd,
		{ dialect:  protocol,
		  protocol: protocol,
		  port:     port,
		  host:     host,
		  storage:  storage, //solo SQLite (.env)
		  omitNULL: true	//solo Postgres
		}
	);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Importar la definición de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la tabla Quiz.
exports.Quiz = Quiz;
// Exportar la tabla Comment.
exports.Comment = Comment;

//sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function () {
	// then(...) ejecuta el manejador una vez terminada de crear la tabla
	Quiz.count().then(function (count){
		if(count === 0) {
			Quiz.create({
			 	pregunta: 'Capital de Italia',
			 	respuesta: 'Roma',
			 	tema: 'humanidades'
			 });
			Quiz.create({
			 	pregunta: 'Capital de Portugal',
			 	respuesta: 'Lisboa',
			 	tema: 'humanidades'
			 })
			.then(function(){ console.log('Base de datos inicializada'); });
		};
	});
});