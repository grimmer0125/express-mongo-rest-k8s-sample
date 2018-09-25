import { Router } from 'express'
import vdobject from './vdobject'

const router = new Router()

router.use('/vdobject', vdobject)

export default router
