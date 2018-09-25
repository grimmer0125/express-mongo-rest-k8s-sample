import mongoose, { Schema } from 'mongoose'

const vdobjectSchema = new Schema({
  versions: [{ _id: false,
    timestamp: Number,

    /**
     * @type {String or Object}
     */
    value: Schema.Types.Mixed }],
  key: {
    type: String,
    index: true
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
