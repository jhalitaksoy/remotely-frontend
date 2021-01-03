
export function convertToBytes(type, message) {
    // create an ArrayBuffer with a size in bytes
    const typeLenght = 1
    const messageLenght = message.length

    const buffer = new ArrayBuffer(typeLenght + messageLenght);
    const view = new DataView(buffer);

    view.setUint8(0, type);

    const textEncoder = new TextEncoder("utf-8")
    const messageBytes = textEncoder.encode(message)

    let count = 1
    for (let byte of messageBytes) {
        view.setUint8(count, byte)
        count++
    }

    return buffer
}

export function convertFromBytes(bytes) {
    const view = new DataView(bytes);

    const type = view.getUint8(0)

    const textDecoder = new TextDecoder("utf-8");

    const message = textDecoder.decode(bytes.slice(1))

    return {
        "type": type,
        "message": message,
    }
}
