import { Vdobject } from '.'

let vdobject

beforeEach(async () => {
  vdobject = await Vdobject.create({ key: 'test', value: 'test', timestamp: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = vdobject.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(vdobject.id)
    expect(view.key).toBe(vdobject.key)
    expect(view.value).toBe(vdobject.value)
    expect(view.timestamp).toBe(vdobject.timestamp)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = vdobject.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(vdobject.id)
    expect(view.key).toBe(vdobject.key)
    expect(view.value).toBe(vdobject.value)
    expect(view.timestamp).toBe(vdobject.timestamp)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
