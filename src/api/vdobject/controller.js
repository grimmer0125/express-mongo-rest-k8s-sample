import { success, notFound } from '../../services/response/'
import { Vdobject } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Vdobject.create(body)
    .then((vdobject) => vdobject.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Vdobject.find(query, select, cursor)
    .then((vdobjects) => vdobjects.map((vdobject) => vdobject.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Vdobject.findById(params.id)
    .then(notFound(res))
    .then((vdobject) => vdobject ? vdobject.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Vdobject.findById(params.id)
    .then(notFound(res))
    .then((vdobject) => vdobject ? Object.assign(vdobject, body).save() : null)
    .then((vdobject) => vdobject ? vdobject.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Vdobject.findById(params.id)
    .then(notFound(res))
    .then((vdobject) => vdobject ? vdobject.remove() : null)
    .then(success(res, 204))
    .catch(next)
