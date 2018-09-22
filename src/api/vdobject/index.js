import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Vdobject, { schema } from './model'

const router = new Router()
const { key, value, timestamp } = schema.tree

/**
 * @api {post} /vdobject Create vdobject
 * @apiName CreateVdobject
 * @apiGroup Vdobject
 * @apiParam key Vdobject's key.
 * @apiParam value Vdobject's value.
 * @apiParam timestamp Vdobject's timestamp.
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */
router.post('/',
  body({ key, value, timestamp }),
  create)

/**
 * @api {get} /vdobject Retrieve vdobjects
 * @apiName RetrieveVdobjects
 * @apiGroup Vdobject
 * @apiUse listParams
 * @apiSuccess {Object[]} vdobjects List of vdobjects.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /vdobject/:id Retrieve vdobject
 * @apiName RetrieveVdobject
 * @apiGroup Vdobject
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /vdobject/:id Update vdobject
 * @apiName UpdateVdobject
 * @apiGroup Vdobject
 * @apiParam key Vdobject's key.
 * @apiParam value Vdobject's value.
 * @apiParam timestamp Vdobject's timestamp.
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */
router.put('/:id',
  body({ key, value, timestamp }),
  update)

/**
 * @api {delete} /vdobject/:id Delete vdobject
 * @apiName DeleteVdobject
 * @apiGroup Vdobject
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Vdobject not found.
 */
router.delete('/:id',
  destroy)

export default router
