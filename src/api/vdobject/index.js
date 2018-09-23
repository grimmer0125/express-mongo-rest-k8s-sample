import { Router } from 'express'
import { middleware as query } from 'querymen'
// import { middleware as body } from 'bodymen'
import { create, index, show } from './controller'
// import { schema } from './model'
export Vdobject, { schema } from './model'

const router = new Router()
// const { key, value, timestamp } = schema.tree

/**
 * @api {post} /vdobject Create or Update vdobject
 * @apiName CreateVdobject
 * @apiGroup Vdobject
 * @apiParam mykey Vdobject's key with its value
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */
router.post('/',
  create)

/**
 * @api {get} /vdobject Retrieve vdobjects
 * @apiName RetrieveVdobjects
 * @apiGroup Vdobject
 * @apiSuccess {Object[]} vdobjects List of vdobjects.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  index)

/**
 * @api {get} /vdobject/:id Retrieve vdobject
 * @apiName RetrieveVdobject
 * @apiGroup Vdobject
* @apiUse listParams*
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */

router.get('/:id',
  query({timestamp: {type: Number}}),
  show)

export default router
