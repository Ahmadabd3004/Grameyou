const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const session = require('express-session')
const router = require('./router/index')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'secret beut',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

app.use(router)

app.listen(port, () => {
  console.log(`Grameyou App listening on http://localhost:${port}/`, )
})