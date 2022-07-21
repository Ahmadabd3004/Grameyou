const { Book } = require('../models/')
const { Op } = require("sequelize");


class Controller {
    static home(req,res) {
        res.render('home')
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
    static genre(req,res) {

        Genre.findAll()
        .then(genre => {
            res.render('genre', {genre})
        })
        .catch(err =>{
            res.send(err)
        })
   
    }

    static readBook(req,res) {
        res.render('formAdd') //diisi apa ya di sini..
    }

    static saveBook(req,res) {
        const {title, author, genre } = req.body
        Book.create({title, author, genre})
            .then(() => {
                res.redirect('myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static deleteReadBook(req,res) {
        let {id} = req.params
        Book.destroy({
            where: {id}
        })
            .then(() => {
                res.redirect('myBooks')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static myBooks(req,res){
        res.redirect('myBooks')
    }

    static readersList(req,res){
        res.redirect('readersList')
    }
}
    
module.exports = Controller