const express = require('express')
const router = express.Router()

const Joi = require('joi')
const bcrypt = require('bcryptjs')

const { User } = require('../model/user')

router.post('/', async (req, res) => {
  const { error } = validate(req.body)

  if (error) return res.status(400).send(error.details[0].message)

  const { email, password } = req.body

  let user = await User.findOne({ email: email })
  if (!user) return res.status(400).send('Invalid email or password')

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password')

  const token = user.generateAuthToken()

  res.send(token)
})

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  }

  return Joi.validate(req, schema)
}

module.exports = router
