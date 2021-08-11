export type CreateMonitorResponse = {
    id: string
}

export type GetMonitorResponse = {
    id: string
    name: string
    url: string
    alertEmail: string
    checkIntervalInSeconds: number
    lastCheckedAt: Date
    httpChecks: GetMonitorResponseHttpCheck[]
}

export type GetMonitorResponseHttpCheck = {
    url: string
    isUp: boolean
    httpResponseCode: number
    httpLatencyInMilliseconds: number
    createdAt: Date
}
