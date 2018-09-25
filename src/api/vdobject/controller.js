import { success, notFound } from '../../services/response/'
import { Vdobject } from '.'

export const create = (req, res, next) => {
  let myKey = null
  let value = null
  for (const key in req.body) {
    if (!myKey) {
      myKey = key
      value = req.body[key]
    } else {
      myKey = null
      value = null
      res.status(400).send('only allow one mykey:value pair!')
      return
    }
  }

  if (!myKey) {
    res.status(400).send('no enough data!')
    return
  }

  if (typeof value !== 'object' && typeof value !== 'string') {
    res.status(400).send('value should be string or object!')
    return
  }

  const timestamp = Math.floor(Date.now() / 1000)

  Vdobject.findOne({key: myKey})
    .then((doc) => {
      if (doc) {
        console.log('mykey exist')
        // case 3: if the timestamp exist, update the versions field
        for (const version of doc.versions) {
          if (version.timestamp === timestamp) {
            console.log('same key and same timestamp, two writing at the same second')
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
        console.log('add 1 version to this object')
        doc.versions.push({value, timestamp})
        doc.save()
          .then(() => { return { key: myKey, value, timestamp } })
          .then(success(res))
          .catch(next)
      } else {
        // case 1: create
        console.log('create !!' + myKey)
        Vdobject.create({key: myKey, versions: [{value, timestamp}]})
          .then(() => { return { key: myKey, value, timestamp } })
          .then(success(res, 201))
          .catch(next)
      }
    })
}

// for debugging
export const index = (req, res, next) => {
  Vdobject.find()
    .then((vdobjects) => vdobjects.map((vdobject) => vdobject.view()))
    .then(success(res))
    .catch(next)
}

export const show = (req, res, next) => {
  const { querymen: { query: { timestamp } } } = req
  const { params } = req
  if (typeof timestamp === 'number' && timestamp > 0) {
    console.log('query timestamp !!')

    // NOTE: aggregation might be slower than
    // interating by self (O(n)), n is the size of versions
    // just for testing
    Vdobject.aggregate(
      [
        { $match: {key: params.myKey}},
        { $unwind: '$versions'},
        { $match: { 'versions.timestamp': { $lte: timestamp }}},
        { $sort: {
          'versions.timestamp': -1
        }},
        { $limit: 1 },
        { $project: {value: '$versions.value'}}]
    )
      .then((vdobjects) => {
        if (vdobjects.length > 0) {
          return {value: vdobjects[0].value}
        } else {
          console.log('no matched timestamp or mykey!!')
          notFound(res)()
        }
      }).then(success(res))
      .catch(next)
  } else {
    Vdobject.findOne({key: params.myKey})
      .then(notFound(res))
      .then((vdobject) => {
        if (vdobject) {
          // find the most recent value
          if (vdobject.versions && vdobject.versions.length > 0) {
            const version = vdobject.versions[vdobject.versions.length - 1]
            if (version.value) {
              return {value: version.value}
            } else {
              console.log('version exist but value disappear, something wrong !!')
            }
          } else {
            console.log('no versions !!')
          }
        }
      }).then(success(res))
      .catch(next)
  }
}
