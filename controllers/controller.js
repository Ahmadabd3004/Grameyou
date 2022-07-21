const { Book, User, Genre } = require('../models/')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

class Controller {
    static home(req, res) {
        res.render('home')
    }


    static bookList(req, res) {

        Book.findAll()
            .then(book => {
                res.render('bookList', { book })
            })
            .catch(err => {
                res.send(err)
            })

    }
    static genre(req, res) { }

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
            query.where = { id }
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
        Book.findOne({ where: { id } })
            .then(books => {
                // res.send(books)
                res.render('bookDetail', { books })
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
                        console.log(req.session)
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

    static logout(req,res){
        req.session.user = {}
        res.redirect('/login')
    }
}

module.exports = Controller