const handleSignin = (db,bcrypt) => (req,res) => 
// const handleSignin = (req,res,db,bcrypt) => 
{
	const {email, password} = req.body;
	if(!email || !password){
		return res.status(400).json('Incorrect form submission');
	}

	db.select('email', 'hash').from('login')
		.where({'email' : email})
		.then(data => {
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
}

module.exports = {
	handleSignin: handleSignin
}