import { Router } from 'express'
import vdobject from './vdobject'

const router = new Router()

router.use('/vdobject', vdobject)

/**
 * @apiDefine listParams
 * @apiParam {Number} [timestamp] Unixtime second unit (e.g. 1537693722).
 */

export default router
