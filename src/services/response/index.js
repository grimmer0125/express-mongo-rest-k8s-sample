export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity)
  }
  return null
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).end()
  return null
}

// TODO: add test
export const badRequest = (res) => (msg) => {
  if (msg) {
    res.status(400).send(msg)
    return null
  }
  res.status(400).end()
  return null
}
