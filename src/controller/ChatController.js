import { post } from '../service/NetworkService';
import { convertToBytes } from '../util/datachannel_util';
import {messageTypes, dataChannel} from '../controller/StreamController';

export function getChat(roomid, callback) {
    post(`/room/chat/${roomid}`, "")
        .then((response) => {
            callback(response.data)
        }).catch((error) => {
            console.log({ error })
            callback(undefined, "Error!")
        })
}

export let onMessageCallback = undefined

export function setOnMessageCallback(callback) { onMessageCallback = callback }

export function onMessage(message) {
    let json = JSON.parse(message);
    console.log("New Chat Message : " + message)
    if (onMessageCallback) {
        onMessageCallback(json)
    }
}

//Convert object array buffer to string 
//function ab2str(buf) {
//    return String.fromCharCode.apply(null, new Uint8Array(buf));
//}

export function sendChatMessage(message){
    dataChannel.send(convertToBytes(messageTypes.chat, JSON.stringify(message)))
}