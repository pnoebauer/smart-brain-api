const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex');

// host : '127.0.0.1' (localhost)
const db = knex({
  	client: 'pg',
  	connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'smart-brain'
  }
});

app.use(cors());

// http://knexjs.org/#Builder-select
//output: query created by knex for db
// console.log(db.select('*').from('users'));

db.select('*').from('users').then(data => {
	// console.log(data);
})

// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '456',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// };

app.use(express.json());

app.get('/',(req,res) =>
{
	// res.send(database.users);
	res.send('This is working');
});

app.post('/register', (req,res) => 
{
	const {name, email, password} = req.body;

	const hash = bcrypt.hashSync(password);

	// DATABASE TRANSACTIONS:
	// insert into multiple tables - if one fails all others will fail automatically
	//ALWAYS USE BELOW IF MORE THAN 1 OPERATION - ALMOST SAME STRUCTURE - DB REPLACED WITH TRX
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*') //knex method to return selected, after the following method
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})//.then(console.log);
				// .returning('*') //knex method to return selected, after the following method
				.then(user => 
				{
					res.json(user[0]);
				})	
		})
		//need to commit to actually insert (if all transactions are successful)
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'));

	// // returning.insert is the same as insert.returning
	// return db('users')
	// 	.returning('*') //knex method to return selected, after the following method
	// 	.insert({
	// 		email: email,
	// 		name: name,
	// 		joined: new Date()
	// 	})//.then(console.log);
	// 	// .returning('*') //knex method to return selected, after the following method
	// 	.then(user => 
	// 	{
	// 		res.json(user[0]);
	// 	})	
	// 	// .catch(err => res.status(400).json(err));
	// 	.catch(err => res.status(400).json('unable to register'));

	// let usersArr = database.users;
	// usersArr.push(
	// 	{
	// 		id: '126',
	// 		name: name,
	// 		email: email,
	// 		password: password,
	// 		entries: 0,
	// 		joined: new Date()
	// 	}
	// )
	// // res.json('Registration successful!');
	// res.json(usersArr[usersArr.length-1]);
	// console.log(database);

});

app.post('/signin', (req,res) => 
{
	const {email, password} = req.body;

	db.select('email', 'hash').from('login')
		// .where('email', '=', email) 
		.where({'email' : email})
		.then(data => {
			// console.log(data[0].email,data[0].hash);
			if(bcrypt.compareSync(password,data[0].hash)){
				return db('users').select('*')
					.where('email','=',data[0].email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('Unable to get user'))
			}
			else {
				res.status(400).json('Fail. The email/password combination is incorrect.');	
			}
		})
		.catch(err => res.status(400).json('Wrong credentials'))
	
	// console.log(req.body);
	// let usersArr = database.users;
	// let found = false;
	// for(let i=0; i<usersArr.length; i++)
	// {
	// 	if(password === usersArr[i].password && 
	// 		email === usersArr[i].email)
	// 	{
	// 		// res.json('Success');
	// 		res.json(usersArr[i]);
	// 		console.log('Success! User data:',usersArr[i]);
	// 		found = true;
	// 		break;
	// 	}
	// }	
	// if(!found) res.status(400).json('Fail. The email/password combination is incorrect.');	
});

//if user id from url matches return the user data
app.get('/profile/:id', (req,res) => {
	const { id } = req.params;
	// let usersArr = database.users;
	// let found = false;
	// for(let i=0; i<usersArr.length; i++)
	// {
	// 	if(id === usersArr[i].id)
	// 	{
	// 		// res.json('Success');
	// 		res.json(usersArr[i]);
	// 		console.log('ID:',req.params.id,' Success! User data:',usersArr[i]);
	// 		found = true;
	// 		break;
	// 	}
	// }	
	// if(!found) res.json('Fail. User does not exist.');	

	// db.select('*').from('users').then(profile => console.log('test',profile));
	db.select('*').from('users').where({id: id})
		.then(profile => {
				if(profile.length) res.json(profile[0]);
				else res.status(400).json('id does not exist');
			}
	)
})

app.put('/image',(req,res) =>
{
	const { id } = req.body;

	// let usersArr = database.users;
	// let found = false;

	// for(let i=0; i<usersArr.length; i++)
	// {
	// 	if(id === usersArr[i].id)
	// 	{
	// 		found = true;
	// 		usersArr[i].entries++;
	// 		return res.json(usersArr[i].entries);
	// 	}
	// }	
	// // if(!found) res.json('Fail. User does not exist.');

	db('users')
  		.where('id', '=', id)
  		.returning('entries')
  		.increment('entries', 1)
  		.then(entries => {
  			// console.log(entries)
  			res.json(entries);
  		})
	})


app.listen(3000, () => 
{
	console.log('App is running on port 3000');
});

/*
steps:
/ --res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user

*/