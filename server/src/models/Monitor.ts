import mongoose, {Schema, Document} from 'mongoose'
import {nanoid} from 'nanoid'

export interface IMonitor extends Document {
    _id: string;
    name: string;
    url: string;
    alertEmail: string;
    checkIntervalInSeconds: number;
    lastCheckedAt: Date;
}

const MonitorSchema: Schema = new Schema({
    _id: {
        type: String,
        default: () => `m_${nanoid()}`
    },
    name: {type: String, required: true},
    url: {type: String, required: true},
    alertEmail: {type: String, required: true},
    checkIntervalInSeconds: {type: Number, required: false},
    lastCheckedAt: {type: Date, required: false}
}, {
    _id: false,
    timestamps: true,
})

export default mongoose.model<IMonitor>('Monitor', MonitorSchema)
