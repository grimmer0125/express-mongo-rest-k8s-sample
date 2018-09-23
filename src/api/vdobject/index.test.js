import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Vdobject } from '.'

const app = () => express(apiRoot, routes)

describe('test api /vdobject', () => {
  let vdobject

  beforeEach(async () => {
    const data = {key: '123', versions: [{value: '456', timestamp: 1537693722}]}
    vdobject = await Vdobject.create(data)
  })

  test('POST /vdobject 400 - no enough data', async () => {
    const { status } = await request(app())
      .post(`${apiRoot}`)
      .send({})
    expect(status).toBe(400)
  })

  test('POST /vdobject 400 - too many data', async () => {
    const { status } = await request(app())
      .post(`${apiRoot}`)
      .send({randomkey: '1234', randomkey2: '1234'})
    expect(status).toBe(400)
  })

  test('POST /vdobject 400 - value is not string/object', async () => {
    const { status } = await request(app())
      .post(`${apiRoot}`)
      .send({randomkey: '1234', randomkey2: false})
    expect(status).toBe(400)
  })

  test('POST /vdobject 201', async () => {
    let { status, body } = await request(app())
      .post(`${apiRoot}`)
      .send({ randomkey: '1234' })
    expect(status).toBe(201)
    expect(typeof body).toEqual('object')
    expect(body.key).toEqual('randomkey')
    expect(body.value).toEqual('1234')
    expect(typeof body.timestamp).toEqual('number')
    expect(body.timestamp).toBeGreaterThan(0)
  })

  test('GET /vdobject 200', async () => {
    console.log('query all vdobjects')
    const { status, body } = await request(app())
      .get(`${apiRoot}`)
    expect(status).toBe(200)
    console.log('list all:', body)
    expect(Array.isArray(body)).toBe(true)
  })

  test('POST /vdobject/ 200 - add/update version for predefined user', async () => {
    // NOTE: if two posts are within 1s, this will just update the value of the timestamp
    // await new Promise(resolve => setTimeout(resolve, 1100))
    console.log('add/update version for predefined user')

    const { status, body } = await request(app())
      .post(`${apiRoot}`)
      .send({ 123: '7777' })
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
    expect(body.key).toEqual('123')
    expect(body.value).toEqual('7777')
    expect(typeof body.timestamp).toEqual('number')
    expect(body.timestamp).toBeGreaterThan(0)
  })

  test('GET /vdobject/:id 200 - exact match timestamp', async () => {
    const { status, body } = await request(app())
      .get(`${apiRoot}/${vdobject.key}?timestamp=${vdobject.timestamp}`)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
    expect(body.value).toEqual(vdobject.versions[0].value)
  })

  test('GET /vdobject/:id?timestamp 200 - find timestamp <= vary large time', async () => {
    const { status, body } = await request(app())
      .get(`${apiRoot}/${vdobject.key}?timestamp=1937701692`)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
  })
})
