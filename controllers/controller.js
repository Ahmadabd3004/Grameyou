const { Book, User, Genre } = require('../models/')
const { Op } = require("sequelize");


class Controller {
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
        res.render('formAdd') //diisi apa ya di sini..
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