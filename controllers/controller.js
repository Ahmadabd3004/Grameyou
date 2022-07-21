const { Book, User, Genre, UsersBook } = require('../models/')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

class Controller {


    static home(req, res) {
        let user = req.session.user
        let id = req.session.user.id
        // res.send('masuk')
        let value = {}
        User.findOne({ where: { id } })
            .then(userData => {
                value.userData = userData
                return Genre.findAll()
            })
            .then(result => {
                res.render('home', { result, userData: value.userData, user })
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
        let value = {}
        Book.findAll(query)
            .then(books => {
                value.books = books
                return Book.totalBook()
            })
            .then(total=>{
                // res.send(total)
                res.render('bookList', { books : value.books, user ,total:total[0].dataValues.count})
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
        let error = req.query.err
        Book.findOne({ where: { id } })
            .then(books => {
                // res.send(books)
                res.render('bookDetail', { books, user, error })
            })

    }

    static saveBook(req, res) {
        const UserId = req.session.user.id
        const timeLeft = "48 hours"
        const BookId = req.params.id
        UsersBook.findAll({ where: { UserId, BookId } })
            .then(book => {
                if (book.length) {
                    const error = 'You only can rent this book once'
                    return res.redirect(`/book/${BookId}/read?err=${error}`)
                } else {
                    return UsersBook.create({ UserId, BookId, timeLeft })
                        .then(() => {
                            res.redirect('/myBooks')
                        })
                        .catch(err => {
                            res.send(err)
                        })
                }
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
                res.redirect('/myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static myBooks(req, res) {
        let user = req.session.user
        let UserId = req.session.user.id
        UsersBook.findAll({
            include: [
                {
                    model: User
                },
                {
                    model: Book
                }
            ],
            where: { UserId }
        })
            .then(userbook => {
                res.render('myBooks', { userbook, user })
            })
    }



    static readersList(req, res) {
        let user = req.session.user
        UsersBook.findAll({
            include: [
                {
                    model: User
                },
                {
                    model: Book
                }
            ]
        })
            .then(userbook => {
                res.render('dataReader', { userbook, user })
            })
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
    static deleteReadBook(req, res) {
        let UserId = req.session.user.id
        let BookId = req.params.id
        UsersBook.destroy({ where: { UserId, BookId } })
            .then(() => {
                res.redirect('/myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }
}

module.exports = Controller