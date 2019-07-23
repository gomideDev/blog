//Imports de modules
const server = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const DB = require('./config/db')
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagem')
const Postagem = mongoose.model('postagens')

const app = server();

//Configurations

    //Session
    app.use(session({
        secret: 'cursoNode',
        resave: true,
        saveUninitialized:true
    }))

    app.use(flash());

    //Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    //Body-parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogAppDb', {useNewUrlParser: true}).then(()=>{
        console.log('Connect database successyfuly!')
    }).catch((err)=>{
        console.log('Connect database fail: '+err)
    })

    //Public
    app.use(server.static(path.join(__dirname, 'public')))

//Routes

app.get('/', (req, res)=>{
    Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('index', {postagens:postagens});
    })
    
})

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug:req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', {postagem:postagem})
        }else{
            req.flash('error_msg', 'Esta postagem não existe!')
            res.redirect('/')
        }
        
    }).catch((err)=>{
        res.render('/404')
    })
})

app.get('/404', (req, res)=>{

})

app.use('/admin', admin);

//Other configurations

const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=>{
    console.log('Server is runing on port: '+PORT);
})

