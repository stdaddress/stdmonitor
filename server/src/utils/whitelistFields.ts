export default function whitelistFields<T>(obj: Object, whitelist: string[]): T {
    const result = {} as T
    for (const field of whitelist) {
        result[field] = obj[field]
    }
    return result
}
