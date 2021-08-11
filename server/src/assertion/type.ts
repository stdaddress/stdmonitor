export function assertInteger(value: unknown, name: string) {
    if (!Number.isInteger(value)) {
        throw new Error(`Assertion error, ${name} is not an integer.`)
    }
}
