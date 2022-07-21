const router = require('express').Router()
const Controller = require('../controllers/controller')

// router.get('/test', Controller.test)
router.get('/register', Controller.register)
router.post('/register', Controller.postRegister)

router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)

router.use(function(req,res,next){
    if (req.session.user) {
        if (req.session.user.id) {
            next()
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
})

router.get('/logout', Controller.logout)
router.get('/', Controller.home)
router.get('/bookList', Controller.bookList)
router.get('/genre', Controller.genre)
router.get('/dataReader', Controller.dataReader)
router.get('/book/:id/read', Controller.readBook)

// router.post('/book/:id/read', Controller.saveBook)
router.get('/book/Add', Controller.formAddBook)
router.post('/book/Add', Controller.addBook)

router.get('/book/:id/edit', Controller.formEditBook)
router.post('/book/:id/edit', Controller.editBook)
router.get('/book/:id/delete', Controller.deleteBook) 
// router.get('/myBooks', Controller.myBooks) 
// router.get('/myBooks/:id/delete', Controller.deleteReadBook) 
// router.get('/readersList', Controller.readersList) //admin

module.exports = router