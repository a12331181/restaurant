const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  Restaurant.find() 
    .lean() 
    .then(restaurants => res.render('index', { restaurants })) 
    .catch(error => console.error(error)) 
})

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})
