export type CreateMonitorRequest = {
    name: string
    url: string
    alertEmail: string
    checkIntervalInSeconds: number
}

export type GetMonitorRequest = {
    monitorId: string
}
