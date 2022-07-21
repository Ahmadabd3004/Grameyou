const { Book, User, Genre } = require('../models/')
const { Op } = require("sequelize");


class Controller {
    static home(req,res) {
        res.render('home')
    }

    static register(req, res){
        res.render('registerForm')
    }

    static postRegister(req,res){
        const {email, password, role} = req.body
        User.create({email, password, role})
        .then(()=> {
            res.redirect('registerForm')
        })
        .catch(err => {
            res.send(err)
        })
    }
    
    static bookList(req,res) {

        Book.findAll()
        .then(book => {
            res.render('bookList', {book})
        })
        .catch(err =>{
            res.send(err)
        })
   
    }
    static genre(req,res) {}

    static home(req, res) {
        // res.send('masuk')
        Genre.findAll()
            .then(result => {
                res.render('home', { result })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static bookList(req, res) {
        let search = req.query.search
        let query = {
            order : [['title', 'ASC']],
        }
        if (search) {
            query.where = {
                title : {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        Book.findAll(query)
            .then(books => {
                res.render('bookList', { books })
            })
            .catch(err => {
                res.send(err)
            })

    }
    static genre(req, res) {
        // res.send(req.query.id)
        let id = req.query.id
        let query = {
            include: Book
        }
        if (id) {
            query.where = {id}
        }
        // res.send(id)
        Genre.findAll(query)
            .then(genre => {
                res.render('genre', { genre })
            })
            .catch(err => {
                res.send(err)
            })

    }

    static readBook(req, res) {
        let id = req.params.id
        Book.findOne({where: {id}})
            .then(books => {
                // res.send(books)
                res.render('bookDetail', {books})
            })
            
    }

    static saveBook(req, res) {
        const { title, author, genre } = req.body
        Book.create({ title, author, genre })
            .then(() => {
                
                res.redirect('myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static deleteReadBook(req, res) {
        let { id } = req.params
        Book.destroy({
            where: { id }
        })
            .then(() => {
                res.redirect('myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static myBooks(req, res) {
        res.redirect('myBooks')
    }

    static readersList(req, res) {
        res.redirect('readersList')
    }
}

module.exports = Controller