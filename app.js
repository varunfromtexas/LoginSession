const express = require("express")
const app = express()
const mustache = require("mustache-express")
const session = require("express-session")
const bodyParser = require("body-parser")
const users = require("./users")
const url = require("url")
app.engine("mustache", mustache())
app.set("view engine", "mustache")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false}))

var sess = {
  secret: "secretkey",
  cookie: {},
  saveUninitialized: true,
  resave: true
}
app.use(session(sess))
//this creates the session

app.use(function(req, res, next){
  req.User = req.session.user
  next()
})
// this says "if user is logged in, go to next middleware"

app.get("/", function(req, res, next){
  req.session.authorized = false
  res.redirect("login")
})

app.get("/login", function(req, res, next){
  res.render("login")
})

app.post("/authorization", function(req, res){
  const username = req.body.username
  const password = req.body.password

  let database
  for (var i=0; i<users.length; i++)
    if (users[i].username === username && users[i].password === password) {
      database = users[i]
    }
    if (database){
      req.session.user = database
      req.session.authorized = true
      res.redirect("/index")
    } else {
      res.render("login", {
        errorMessage: "incorrect login. please try again"
      })
    }
})

app.use(function(req, res, next){
  req.user = req.session.user
  next()
})

app.get("/index", function(req, res, next){
  const currentUser = req.user
  res.render("index", {
    currentUser: currentUser
  })
})



app.listen(3000, function(){
  console.log("listening on 3000")
})
