import { success, notFound, badRequest } from '../../services/response/'
import { Vdobject } from '.'
import Debug from 'debug'
const debug = Debug('verbose')

const checkCreatePostBody = (req, res, next) => {
  let myKey = null
  let value = null
  for (const key in req.body) {
    if (!myKey) {
      myKey = key
      value = req.body[key]
    } else {
      myKey = null
      value = null
      badRequest(res)('only allow one mykey:value1 pair!')
      return {}
    }
  }

  if (!myKey) {
    badRequest(res)('no enough data!')
    return {}
  }

  if (typeof value !== 'object' && typeof value !== 'string') {
    badRequest(res)('value should be string or object!')
    return {}
  }

  return {myKey, value}
}

export const create = (req, res, next) => {
  const {myKey, value} = checkCreatePostBody(req, res)
  if (!myKey) {
    return
  }

  const timestamp = Math.floor(Date.now() / 1000)

  Vdobject.findOne({key: myKey})
    .then((doc) => {
      if (doc) {
        debug('mykey exist')
        // case 1: if the timestamp exist, update the versions field
        for (const version of doc.versions) {
          if (version.timestamp === timestamp) {
            debug('same key and same timestamp, two writing at the same second')
            // just update the value field
            version.timestamp = timestamp
            version.value = value
            doc.save()
              .then(() => { return { key: myKey, value, timestamp } })
              .then(success(res))
              .catch(next)
            return
          }
        }

        // case 2, add 1 version to this object
        debug('add 1 version to this object')
        doc.versions.push({value, timestamp})
        doc.save()
          .then(() => { return { key: myKey, value, timestamp } })
          .then(success(res))
          .catch(next)
      } else {
        // case 3: create
        debug('create !!' + myKey)
        Vdobject.create({key: myKey, versions: [{value, timestamp}]})
          .then(() => { return { key: myKey, value, timestamp } })
          .then(success(res, 201))
          .catch(next)
      }
    })
}

export const index = (req, res, next) => {
  Vdobject.find()
    .then((vdobjects) => vdobjects.map((vdobject) => vdobject.view()))
    .then(success(res))
    .catch(next)
}

const queryWithTimeStamp = (res, next, myKey, timestamp) => {
  debug('query with timestamp !!')

  // NOTE: mongo aggregation might be a little slower than interating by self (O(c1*n)),
  // althought it should be (O(c2*n)). n is the size of versions. Anyway just use it first
  Vdobject.aggregate(
    [
      {$match: {key: myKey}},
      {$unwind: '$versions'},
      {$match: {'versions.timestamp': { $lte: timestamp }}},
      {$sort: {
        'versions.timestamp': -1
      }},
      {$limit: 1},
      {$project: {value: '$versions.value'}}]
  )
    .then((vdobjects) => {
      if (vdobjects.length > 0) {
        return {value: vdobjects[0].value}
      } else {
        debug('no matched timestamp or mykey!!')
        notFound(res)()
      }
    }).then(success(res))
    .catch(next)
}

export const show = (req, res, next) => {
  const { querymen: { query: { timestamp } } } = req
  const { params: { myKey } } = req
  if (typeof timestamp === 'number' && timestamp > 0) {
    queryWithTimeStamp(res, next, myKey, timestamp)
  } else {
    debug('query with no timestamp !!')
    Vdobject.findOne({key: myKey})
      .then(notFound(res))
      .then((vdobject) => {
        // find the most recent value
        if (vdobject.versions && vdobject.versions.length > 0) {
          const version = vdobject.versions[vdobject.versions.length - 1]
          return {value: version.value}
        } else {
          // there is no delete action so this should not happen
          debug('no versions, something wrong !!')
        }
      }).then(success(res))
      .catch(next)
  }
}
