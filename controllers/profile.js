const handleProfile = (req,res,db) => {
	const { id } = req.params;
	db.select('*').from('users').where({id: id})
		.then(profile => {
				if(profile.length) res.json(profile[0]);
				else res.status(400).json('id does not exist');
			}
		)
}

module.exports = {
	handleProfile: handleProfile
}