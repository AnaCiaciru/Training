var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});


// Create a new Express application.
var app = express();
app.use(express.static("public"));

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
    function(req, res) {
        res.render('home', { user: req.user });
    });

app.get('/home',
    function(req, res) {
        res.render('home', { user: req.user });
    });

app.get('/about',
    function(req, res) {
        res.render('about', { user: req.user });
    });

app.get('/parcurs',
    function(req, res) {
        res.render('parcurs', { user: req.user });
    });


app.get('/login',
    function(req, res){
        res.render('login', { user: req.user });
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

//for blog

var posts = [
    { titlu: 'Primul Training tinut de mine', descriere: 'In teambuildingul celor de la facultatea de litere. A fost un training de motivare si incredere cu putin teamwork.', date: 'Wed Jan 15 2020', imagine : '/images/primul.jpg'},
    { titlu: 'InTrain', descriere: 'InTrain este adunarea generala a trainerilor din intreaga tara si este organizat de Uniunea Studentilor din Romania.', date: 'Wed Jan 15 2020', imagine : '/images/intrain.jpg'}
];

app.get('/blog',
    function(req, res) {
        console.log(posts);
        res.render('blog', { user: req.user, posts: posts });
    });

app.post("/newpost", function(req, res){
    var date = new Date();
    var d = date.toDateString();
    var newPost = { titlu: req.body.titlu, descriere: req.body.descriere, date: d , imagine: req.body.imagine };

    posts.push(newPost);
    res.redirect("/blog");
});


app.get("/post/:index", function(req, res){
    console.log(posts);

    var index = req.params.index;
    var post = posts[index];

   res.render('post', {user: req.user, post: post }  );
});

/// planificare consultanta

var consultatii = [
    {nume: "Popa", pren: "Ion", start: "17:00", final: "21:00"},
    {nume: "Toader", pren: "Alexandra", start: "08:00", final: "12:00"}
];

/// nedisponibil
var nedisp = [
    {date: "", start: "", final: ""}
];

app.get('/planificare',
    function(req, res) {
        res.render('planificare', { user: req.user, nedisp: nedisp });
    });

app.post("/newRequest", function(req, res){

    var start = req.body.hstart;
    var final = req.body.hfinal;
    var date = req.body.day;

    var i, ok = 1;
    for(i = 0; i < nedisp.length && ok == 1; i++)
        if(nedisp.start == start && nedisp.final == final)
                ok = 0;
    if(ok == 1) {
        var x = {date: date, start: start, final: final};
        nedisp.push(x);
        console.log(nedisp);
        res.redirect("/planificare/?succes");
    }
    res.redirect("/planificare/?eroare");
});


app.listen(3000, "127.0.0.1", function(){
    console.log("Server is listening!!!");
});
