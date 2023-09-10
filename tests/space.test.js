const db = require('../models')
const request = require('supertest')
const app = require('../app')
const { describe } = require('../models/space_owner')
require('dotenv').config()

let token = ''

beforeAll(async () => {
  console.log("here")
  await db.sequelize.sync()
})

describe('POST /auth/login', () => {
    test('It should respond with a token', async () => {
      console.log("here")
        const response = await request(app).post('/auth/login').send({
            email: "user1@test.com",
            password: "123456"
          })
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('token')
        token = response.body.token
    })
})