const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId }) 
    .lean() 
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants })) 
    .catch(error => console.error(error)) 
})

module.exports = router