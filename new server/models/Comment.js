import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    },
    { timestamps: true },
)

export default mongoose.model('Comment', CommentSchema)
