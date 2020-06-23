const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors('*'))

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Server is running!'
  })
})

app.post('/login', (req, res) => {
  const {email, password} = req.body
  const user = {
    id: 1,
    email: 'admin@server.com'
  }
  if(email === 'admin@server.com' && password === '123123'){
    res.send({
      success: true,
      token: jwt.sign(user, 'myServer')
    })
  }else{
    res.status(401).send({
      success: false,
      message: 'Wrong email or password'
    })
  }
})

app.post('/user', (req, res) => {
  if(req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')){
    const rawToken = req.headers['authorization'].substr(7)
    jwt.verify(rawToken, 'myServer', (err, data) => {
      try{
        if (err) throw err
      } catch(e){
        res.status(401).send({
          success: false,
          message: 'Unauthorized'
        })
      }
      res.send({
        success: true,
        message: 'User has been created',
        data: req.body
      })
    })
  } else {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    })
  }
})

app.get('*', (req, res) => {
  res.send({
    success: false,
    message: 'Page not found!'
  })
})

app.listen(8080, ()=>{
  console.log('App Listen on Port 8080')
})