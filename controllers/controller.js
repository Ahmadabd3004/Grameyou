const { Book, User, Genre, UsersBook } = require('../models/')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

class Controller {


    static home(req, res) {
        let user = req.session.user
        // res.send('masuk')
        Genre.findAll()
            .then(result => {
                res.render('home', { result, user })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static bookList(req, res) {
        let user = req.session.user
        let search = req.query.search
        let query = {
            order: [['title', 'ASC']],
        }
        if (search) {
            query.where = {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }
        Book.findAll(query)
            .then(books => {
                res.render('bookList', { books, user })
            })
            .catch(err => {
                res.send(err)
            })

    }
    static genre(req, res) {
        // res.send(req.query.id)
        let user = req.session.user
        let id = req.query.id
        let query = {
            include: Book
        }
        if (id) {
            query.where = { id }
        }
        // res.send(id)
        Genre.findAll(query)
            .then(genre => {
                res.render('genre', { genre, user })
            })
            .catch(err => {
                res.send(err)
            })

    }

    static readBook(req, res) {
        let id = req.params.id
        let user = req.session.user
        Book.findOne({ where: { id } })
            .then(books => {
                // res.send(books)
                res.render('bookDetail', { books, user })
            })

    }

    static saveBook(req, res) {
        const UserId = req.session.user.id
        const timeLeft = "48 hours"
        const BookId = req.params.id
        UsersBook.create({ UserId, BookId, timeLeft })
            .then(

                res.redirect('myBooks')
            )
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
        UsersBook.findAll()
            .then(userbook => {
                res.send(userbook)
                res.redirect('myBooks', {userbook})
                
            })
    }

    static deleteReadBook(req, res) {

    }

    static readersList(req, res) {
        res.redirect('readersList')
    }

    static register(req, res) {
        res.render('registerForm')
    }

    static postRegister(req, res) {
        // res.send(req.body)
        let { username, password, role } = req.body
        User.create({ username, password, role })
            .then(() => {
                res.redirect('/login')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static loginForm(req, res) {
        let error = req.query.err
        res.render('loginForm', { error })
    }
    static postLogin(req, res) {
        let { username, password } = req.body
        User.findOne({ where: { username } })
            .then(user => {
                if (user) {
                    const isValid = bcrypt.compareSync(password, user.password);
                    if (isValid) {
                        req.session.user = user
                        res.redirect('/')
                    } else {
                        const err = 'Password not found'
                        res.redirect(`/login?err=${err}`)
                    }
                } else {
                    const err = 'Username not found'
                    res.redirect(`/login?err=${err}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static logout(req, res) {
        req.session.user = {}
        res.redirect('/login')
    }

    static formAddBook(req, res) {
        let user = req.session.user
        let errors = req.query.err
        Genre.findAll()
            .then(genres => {
                res.render('formAddBook', { genres, errors, user })
            })
            .catch(err => {
                res.send(err)
            })
    }

    static addBook(req, res) {
        let { title, author, GenreId } = req.body
        Book.create({ title, author, GenreId })
            .then(() => {
                res.redirect('/bookList')
            })
            .catch(err => {
                if (err.name == "SequelizeValidationError") {
                    let errors = err.errors.map(el => el.message).join(', ')
                    res.redirect(`/book/add?err=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static formEditBook(req, res) {
        let errors = req.query.err
        let id = req.params.id
        let user = req.session.user
        let values = {}
        Book.findOne({ where: { id } })
            .then(book => {
                values.book = book
                return Genre.findAll()
            })
            .then(genres => {
                res.render('formEditBook', { genres, errors, book: values.book, user })
            })
            .catch(err => {
                res.send(err)
            })
    }
    static editBook(req, res) {
        let id = req.params.id
        let { title, author, GenreId } = req.body
        Book.update({ title, author, GenreId }, { where: { id } })
            .then(() => {
                res.redirect('/bookList')
            })
            .catch(err => {
                if (err.name == "SequelizeValidationError") {
                    let errors = err.errors.map(el => el.message).join(', ')
                    res.redirect(`/book/${id}/edit?err=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }
    static deleteBook(req, res) {
        let id = req.params.id
        Book.destroy({ where: { id } })
            .then(() => {
                res.redirect('/bookList')
            })
            .catch(err => {
                res.send(err)
            })
    }
    static dataReader(req,res){
    }
}

module.exports = Controller