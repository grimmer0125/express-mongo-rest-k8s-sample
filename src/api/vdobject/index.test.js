import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Vdobject } from '.'

const app = () => express(apiRoot, routes)

let vdobject

beforeEach(async () => {
  vdobject = await Vdobject.create({})
})

test('POST /vdobject 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ key: 'test', value: 'test', timestamp: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.key).toEqual('test')
  expect(body.value).toEqual('test')
  expect(body.timestamp).toEqual('test')
})

test('GET /vdobject 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /vdobject/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${vdobject.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(vdobject.id)
})

test('GET /vdobject/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /vdobject/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${vdobject.id}`)
    .send({ key: 'test', value: 'test', timestamp: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(vdobject.id)
  expect(body.key).toEqual('test')
  expect(body.value).toEqual('test')
  expect(body.timestamp).toEqual('test')
})

test('PUT /vdobject/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ key: 'test', value: 'test', timestamp: 'test' })
  expect(status).toBe(404)
})

test('DELETE /vdobject/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${vdobject.id}`)
  expect(status).toBe(204)
})

test('DELETE /vdobject/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
