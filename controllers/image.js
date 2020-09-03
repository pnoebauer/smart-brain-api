const Clarifai = require('clarifai');
const app = new Clarifai.App({
 apiKey: '2b68bbbf227e4e92897cf6a12db1dd68'
});

const handleApiCall = (req,res) =>
{
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('unable to work with API'))
}

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
	handleImage: handleImage,
  handleApiCall: handleApiCall
}