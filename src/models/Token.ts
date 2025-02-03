import mongoose, { Schema, Document, Types } from 'mongoose'
import User from './User'

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createAt: Date
}

const tokenSchema : Schema = new Schema ({
    token: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: User
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    }
})
const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token