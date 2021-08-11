import mongoose, {Schema, Document} from 'mongoose'
import {nanoid} from 'nanoid'

export interface IHttpCheck extends Document {
    _id: string
    monitorId: string
    url: string
    isUp: boolean
    httpResponseCode: number
    httpResponseBody: string
    httpLatencyInMilliseconds: number
}

const HttpCheckSchema: Schema = new Schema({
    _id: {
        type: String,
        default: () => `m_${nanoid()}`
    },
    monitorId: {type: String, required: true},
    url: {type: String, required: true},
    isUp: {type: Boolean, required: true},
    httpResponseCode: {type: Number, required: false},
    httpResponseBody: {type: String, required: false},
    httpLatencyInMilliseconds: {type: Number, required: false}
}, {
    _id: false,
    timestamps: true,
})

export default mongoose.model<IHttpCheck>('HttpCheck', HttpCheckSchema)
