
import { wsServerUrl } from '../service/NetworkService';
import { decode, encode } from '../util/encode_decode_message';
export class RealtimeMessageTransportWS {

    constructor() {
        this.messageChannels = {}
    }

    initWebSocket(roomid, onopen) {
        const ws =new  WebSocket(wsServerUrl() + "/room/ws/" + roomid + "?token=" + window.jwtKey())
        ws.binaryType = "arraybuffer"; //for firefox
        ws.onopen = () => {
            console.log('ws has opened')
            this.ws = ws
            onopen()
        }
        ws.onclose = () => {
            console.log('ws has closed')
            this.ws = undefined
        }

        ws.onmessage = (e)=>{
            this.onDataChannelMessage(this, e)
        }

        ws.addEventListener("error", ev => {
            console.log({ ws_error: ev });
        })
    }

    sendMessage(channel, message) {
        if(this.ws === undefined){
            console.log('ws is undefined')
            return
        }
        const data = encode(channel, message)
        console.log("(RTMT) Sending message to channel " + channel);
        this.ws.send(data)
    }

    listenMessage(channel, callback) {
        this.messageChannels[channel] = callback
    }

    onDataChannelMessage(rtmt, e) {
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