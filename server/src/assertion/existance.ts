export function assertExists(value: unknown, name: string): void {
    if (value === null || value === undefined) {
        throw new Error(`Assertion failure, ${name} is either null or undefined.`)
    }
}
