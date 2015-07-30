var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next){
    // guardar path en session.redir para después de login
    if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use(function(req, res, next){

    var currentTime;

    if (req.session.user){
        currentTime = Date.now();
        if (req.session.user.lastTime && currentTime > req.session.user.lastTime + 120000){
            delete req.session.user;
//He añadido a layout.ejs un script que si existe la variable de sesión alert,
//muestra una alerta con el mensaje y borra la variable de sesión
            req.session.alert = "La sesión ha expirado.";
            req.session.errors = [{message: "Por favor, introduzca de nuevo su usuario y contraseña si desea seguir autenticado."}];
            res.redirect("/login");
        } else {
            req.session.user.lastTime = currentTime;
            next();
        }
    } else {
        next();
    }
});

app.use('/', routes);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: { status: err.status },
        errors: []
    });
});

module.exports = app;