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
router.get('/book/:id/read', Controller.readBook)
router.post('/book/:id/read', Controller.saveBook)
// router.get('/book/:id/add', Controller.addBook)
// router.post('/book/:id/add', Controller.saveAddBook)
// router.get('/book/:id/delete', Controller.deleteReadBook) 
router.get('/myBooks', Controller.myBooks) 
// router.get('/readersList', Controller.readersList) //admin

module.exports = router