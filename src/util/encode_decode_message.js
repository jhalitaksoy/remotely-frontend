const headerLenght = 4
//
// channel is string, message is byte array
//
export function encode(channel, message) {
    const channelLenght = channel.length
    const messageLenght = message.length
    const totalLenght = headerLenght + channelLenght + messageLenght

    const buffer = new ArrayBuffer(totalLenght);
    const view = new DataView(buffer);

    view.setUint32(0, channelLenght);

    const textEncoder = new TextEncoder("utf-8")
    const channelBytes = textEncoder.encode(channel)

    let count = headerLenght
    for (let byte of channelBytes) {
        view.setUint8(count, byte)
        count++
    }

    for (const byte of message) {
        view.setUint8(count, byte)
        count++
    }

    return buffer
}

// 
// return { channel :  string, message :  byte array} 
//
export function decode(bytes) {
    const view = new DataView(bytes);

    const channelLenght = view.getUint32(0)

    const textDecoder = new TextDecoder("utf-8");

    const channel = textDecoder.decode(
        bytes.slice(headerLenght, headerLenght + channelLenght))

    const message =  bytes.slice(headerLenght + channelLenght)

    return {
        "channel": channel,
        "message": message,
    }
}
