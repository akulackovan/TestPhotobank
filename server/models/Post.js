import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        city: { type: String },
        image: { type: Buffer },
        text: { type: String, required: true },
        imgUrl: { type: String, default: '' },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        timestamps: {type: Date},
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
)

export default mongoose.model('Post', PostSchema)