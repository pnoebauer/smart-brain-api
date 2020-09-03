const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '456',
			name: 'Sally',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com',

		}
	]
};

// for(let i=0; i<database.users.length; i++){
// 	console.log('for',database.users[i],i);
// }

// database.users.forEach((item,index)=>{
// 	console.log('forEach',item,index);
// })

app.use(express.json());

app.get('/',(req,res) =>
{
	res.send('This is working');
});

app.post('/register', (req,res) => 
{
	const {name, email, password} = req.body;
	let usersArr = database.users;
	
	bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
	});

	usersArr.push(
		{
			id: '126',
			name: name,
			email: email,
			password: password,
			entries: 0,
			joined: new Date()
		}
	)

	// res.json('Registration successful!');
	res.json(usersArr[usersArr.length-1]);
	console.log(database);
});

app.post('/signin', (req,res) => 
{
	// console.log(req.body);
	const {name, email} = req.body;
	let usersArr = database.users;

	let found = false;
	for(let i=0; i<usersArr.length; i++)
	{
		if(name === usersArr[i].name && 
			email === usersArr[i].email)
		{
			// res.json('Success');
			res.json(usersArr[i]);
			console.log('Success! User data:',usersArr[i]);
			found = true;
			break;
		}
	}	
	if(!found) res.json('Fail. User does not exist.');	
});

//if user id from url matches return the user data
app.get('/profile/:id', (req,res) => {
	let usersArr = database.users;
	let found = false;
	const { id } = req.params;
	for(let i=0; i<usersArr.length; i++)
	{
		if(id === usersArr[i].id)
		{
			// res.json('Success');
			res.json(usersArr[i]);
			console.log('ID:',req.params.id,' Success! User data:',usersArr[i]);
			found = true;
			break;
		}
	}	
	if(!found) res.json('Fail. User does not exist.');	
})

app.put('/image',(req,res) =>
{
	let usersArr = database.users;
	let found = false;
	const { id } = req.body;
	for(let i=0; i<usersArr.length; i++)
	{
		if(id === usersArr[i].id)
		{
			found = true;
			usersArr[i].entries++;
			return res.json(usersArr[i].entries);
		}
	}	
	if(!found) res.json('Fail. User does not exist.');
})


// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});

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