
import { decode, encode } from '../util/encode_decode_message';
export class RealtimeMessageTransportDC {

    constructor() {
        this.messageChannels = {}
    }

    setDataChannel(dataChannel) {
        dataChannel.binaryType = "arraybuffer"; //for firefox
        dataChannel.onopen = () => {
            console.log('DataChannel has opened')
            this.dataChannel = dataChannel
        }
        dataChannel.onclose = () => {
            console.log('DataChannel has closed')
            this.dataChannel = undefined
        }

        dataChannel.onmessage = (e)=>{
            this.onDataChannelMessage(this, e)
        }

        dataChannel.addEventListener("error", ev => {
            console.log({ datachannel_error: ev });
        })
    }

    sendMessage(channel, message) {
        if(this.dataChannel === undefined){
            console.log('DataChannel is undefined')
            return
        }
        const data = encode(channel, message)
        this.dataChannel.send(data)
    }

    listenMessage(channel, callback) {
        this.messageChannels[channel] = callback
    }

    onDataChannelMessage(rtmt, e) {
        console.log(e.data);
        const { channel, message } = decode(e.data)
        rtmt.onMessage(channel, message)
    }

    onMessage(channel, message){
        const callback = this.messageChannels[channel]
        if(callback){
            callback(message)
        }else{
            console.log("Channel callback not found!" + channel);
        }
    }
}