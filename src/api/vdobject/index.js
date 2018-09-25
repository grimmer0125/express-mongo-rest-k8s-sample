import { Router } from 'express'
import { middleware as query } from 'querymen'
import { create, index, show } from './controller'
export Vdobject, { schema } from './model'

const router = new Router()

/**
 * @api {post} /vdobject Create or Update vdobject
 * @apiName CreateVdobject
 * @apiGroup Vdobject
 * @apiParam mykey Vdobject's key with its value, e.g. {mykey : value1}
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
 * @api {get} /vdobject/:myKey Retrieve vdobject
 * @apiName RetrieveVdobject
 * @apiGroup Vdobject
 * @apiUse listParams
 * @apiSuccess {Object} vdobject Vdobject's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Vdobject not found.
 */
router.get('/:myKey',
  query({timestamp: {type: Number}}),
  show)

export default router
