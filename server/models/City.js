import mongoose from 'mongoose'

const City = new mongoose.Schema(
    {
    city: { type: String, required: true },
    },
)

export default mongoose.model('City', PostSchema)