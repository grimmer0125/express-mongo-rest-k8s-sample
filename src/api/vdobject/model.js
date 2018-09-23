import mongoose, { Schema } from 'mongoose'

const vdobjectSchema = new Schema({
  // version: Schema.Types.Mixed (<- can not be used for real data type, mongoose may fail to save)
  // so the type should be clearly specifed
  versions: [{ timestamp: Number,
    // string or object. mongoose will convert it to the specified type
    value: Schema.Types.Mixed }],
  key: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

vdobjectSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      key: this.key,
      versions: this.versions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Vdobject', vdobjectSchema)

export const schema = model.schema
export default model
