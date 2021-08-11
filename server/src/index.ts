import express from 'express'
import jsonRouter from 'express-json-rpc-router'
import {CreateMonitorRequest, GetMonitorRequest} from "./types/requests";
import {CreateMonitorResponse, GetMonitorResponse} from "./types/responses";
import {assertExists} from "./assertion/existance";
import {assertValidEmail} from "./assertion/email";
import {assertInteger} from "./assertion/type";
import Monitor from "./models/Monitor";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import axios from "axios";
import HttpCheck from "./models/HttpCheck";
import whitelistFields from "./utils/whitelistFields";

dotenv.config()

const app = express()

const beforeController = {
    createMonitor(params: CreateMonitorRequest, _, raw) {
        assertExists(params.name, 'name')
        assertExists(params.url, 'url')
        assertExists(params.alertEmail, 'alertEmail')
        assertValidEmail(params.alertEmail, 'alertEmail')
        assertExists(params.checkIntervalInSeconds, 'checkIntervalInSeconds')
        assertInteger(params.checkIntervalInSeconds, 'checkIntervalInSeconds')
        if (params.checkIntervalInSeconds < 30) {
            throw new Error('checkIntervalInSeconds must be greater than 30.')
        }
    },
    getMonitor(params: GetMonitorRequest) {
        assertExists(params.monitorId, 'monitorId')
    }
}

const controller = {
    ping() {
        return 'pong'
    },

    async createMonitor(req: CreateMonitorRequest): Promise<CreateMonitorResponse> {
        const monitor = new Monitor({
            name: req.name,
            url: req.url,
            alertEmail: req.alertEmail,
            checkIntervalInSeconds: req.checkIntervalInSeconds
        })
        await monitor.save()
        return {
            id: monitor.id
        }
    },

    async getMonitor(req: GetMonitorRequest): Promise<GetMonitorResponse> {
        const monitor = await Monitor.findOne({_id: req.monitorId})
        assertExists(monitor, 'monitor')
        const httpChecks = await HttpCheck.find({monitorId: monitor._id})
            .sort('-createdAt')
        return {
            ...whitelistFields(monitor, ['id', 'name', 'url', 'alertEmail', 'checkIntervalInSeconds', 'lastCheckedAt']),
            httpChecks: httpChecks.map(httpCheck => whitelistFields(httpCheck, ['url', 'isUp', 'httpResponseCode', 'httpLatencyInMilliseconds', 'createdAt']))
        }
    }

}

setInterval(async () => {
    const monitors = await Monitor.find({})
    await Promise.all(monitors.map(async monitor => {
        if (!monitor.lastCheckedAt || (monitor.lastCheckedAt.getTime() + monitor.checkIntervalInSeconds * 1000) < new Date().getTime()) {
            const check = new HttpCheck({
                monitorId: monitor.id,
                url: monitor.url,
            })
            const start = new Date()
            try {
                const response = await axios.get(monitor.url, {
                    timeout: 10000
                })
                check.isUp = true
                check.httpResponseCode = response.status
                check.httpResponseBody = response.data
            } catch (e) {
                check.isUp = false
                check.httpResponseCode = e.response.status
                check.httpResponseBody = e.response.body
            }
            const end = new Date()
            check.httpLatencyInMilliseconds = end.getTime() - start.getTime()
            await check.save()
            monitor.lastCheckedAt = new Date()
            await monitor.save()
            console.log(check.monitorId, check.isUp, check.httpLatencyInMilliseconds)
        }
    }))
}, 1000)

app.use(express.json())
app.use('/jsonrpc', jsonRouter({
    beforeMethods: beforeController,
    methods: controller
}))

app.listen(4000, () => {
    console.log('stdmonitor server listening on port 4000')
})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected.'))
