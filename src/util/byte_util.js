const textEncoder = new TextEncoder("utf-8")
const textDecoder = new TextDecoder("utf-8")

export function encodeText(text) {
    const bytes = textEncoder.encode(text)
    return bytes
}

export function decodeText(bytes) {
    return textDecoder.decode(bytes)
}