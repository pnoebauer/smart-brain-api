const express = require('express');
const app = express();

const bcrypt = require('bcrypt-nodejs');

const cors = require('cors');
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '456',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
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
	res.send(database.users);
	// res.send('This is working');
});

app.post('/register', (req,res) => 
{
	const {name, email, password} = req.body;
	let usersArr = database.users;

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
	console.log(req.body);
	const {email, password} = req.body;
	let usersArr = database.users;

	let found = false;
	for(let i=0; i<usersArr.length; i++)
	{
		if(password === usersArr[i].password && 
			email === usersArr[i].email)
		{
			// res.json('Success');
			res.json(usersArr[i]);
			console.log('Success! User data:',usersArr[i]);
			found = true;
			break;
		}
	}	
	if(!found) res.status(400).json('Fail. The email/password combination is incorrect.');	
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
	// if(!found) res.json('Fail. User does not exist.');
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