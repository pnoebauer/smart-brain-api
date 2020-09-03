const handleImage = (req,res,db) =>
{
	const { id } = req.body;
	db('users')
  		.where('id', '=', id)
  		.returning('entries')
  		.increment('entries', 1)
  		.then(entries => {
  			// console.log(entries)
  			res.json(entries);
  		})
}

module.exports = {
	handleImage: handleImage
}