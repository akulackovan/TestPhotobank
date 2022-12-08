import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        city: { type: mongoose.Schema.Types.ObjectId, ref: 'City'  },
        image: { type: Buffer },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        subscriptions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserSchema',
            },
        ],
    },
    { timestamps: true },
)

export default mongoose.model('User', UserSchema)