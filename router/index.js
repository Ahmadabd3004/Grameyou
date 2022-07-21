// /home ()
// /bookList
// /genre/:id   (bookByGenre)
// /bookByGenre
// /books/:id
// /books/:id/read => balik myBooks
// /books/:id/delete (admin)(users) => balik booklist,balik myBooks
// /myBooks 
// /readerList (admin)

// - database
// - routes

const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/', Controller.home)
router.get('/bookList', Controller.bookList)
router.get('/genre', Controller.genre)
router.get('/book/:id/read', Controller.readBook)
router.post('/book/:id/read', Controller.saveBook)
router.get('/book/:id/delete', Controller.deleteReadBook) 
router.get('/myBooks', Controller.myBooks) 
router.get('/readersList', Controller.readersList) //admin

module.exports = router