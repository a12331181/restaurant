const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get("/search", (req, res) => {
  const keyword = req.query.keyword
  console.log(keyword)
  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const filterList = restaurants.filter((restaurant) =>
        restaurant.name.includes(keyword)
      )
      res.render("index", { restaurants: filterList})
    })
    .catch(() => console.log("search error"))
})

router.post('/filter', (req, res) => {
  const filterCategory = req.body.filterCategory
  const sortType = {
    "A-Z": ["name_en", "asc"],
    "Z-A": ["name_en", "desc"],
    "category": ["category", "asc"],
    "location": ["location", "asc"],
  }
  const [type, method] = sortType[filterCategory]
  Restaurant.find()
    .sort({ [type]: method })
    .lean()
    .then((restaurants) =>
      res.render("index", {restaurants})
    )
    .catch(() => console.log("filter error"))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description} = req.body   
  return Restaurant.create({ 
    name, 
    name_en, 
    category, 
    image, 
    location, 
    phone, 
    google_map, 
    rating, 
    description
  }) 
    .then(() => res.redirect('/')) 
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean() 
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(()=> res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router