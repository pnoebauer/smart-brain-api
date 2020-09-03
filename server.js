// "start:dev": "nodemon server.js"

const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  	client: 'pg',
  	connection: {
  	//--------heroku------
    connectionString: process.env.DATABASE_URL, //heroku
    ssl: {
    	rejectUnauthorized: false
  	},
    //--------heroku------
    /*host : '127.0.0.1', // host: '127.0.0.1' (localhost)
    user: '',
    password: '',
    database: 'smart-brain'*/
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {res.json('This is working')});

// app.post('/register', register.handleRegister(db,bcrypt)(req,res));
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)}); 
// app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)}); //see advanced functions
app.post('/signin', signin.handleSignin(db,bcrypt));
app.get('/profile/:id', (req,res) => {profile.handleProfile(req,res,db)});
app.put('/image',(req,res) => {image.handleImage(req,res,db)});
app.post('/imageurl',(req,res) => {image.handleApiCall(req,res)});

app.listen(process.env.PORT || 3000, () => {
	console.log(`App is running on port ${process.env.PORT}`);
});