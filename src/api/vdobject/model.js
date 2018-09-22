import mongoose, { Schema } from 'mongoose'

const vdobjectSchema = new Schema({
  key: {
    type: String
  },
  value: {
    type: String
  },
  timestamp: {
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
      value: this.value,
      timestamp: this.timestamp,
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
