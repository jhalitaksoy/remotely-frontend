import { post } from '../service/NetworkService';
import { encode } from '../util/encode_decode_message';
import { messageTypes, dataChannel } from '../controller/StreamController';

/// chat message

const ChannelChat = "chat"

export function getChat(roomid, callback) {
    post(`/room/chat/${roomid}`, "")
        .then((response) => {
            callback(response.data)
        }).catch((error) => {
            console.log({ error })
            callback(undefined, "Error!")
        })
}

export function sendChatMessage(message) { 
    const json = JSON.stringify(message)
    console.log(json);
    const textEncoder = new TextEncoder("utf-8")
    const messageBytes = textEncoder.encode(json)
    window.rtmt.sendMessage(ChannelChat,messageBytes)
}

export function listenChatMessage(callback){
    window.rtmt.listenMessage(ChannelChat, (message)=>{
        const textDecoder = new TextDecoder("utf-8")
        const json = textDecoder.decode(message)
        const chatMessage = JSON.parse(json)
        callback(chatMessage)
    })
}

/// survey

export function createSurvey(survey) {
    dataChannel.send(encode(messageTypes.surveyCreate, JSON.stringify(survey)))
}

export let onSurveyCreateMessageCallback = undefined

export function setSurveyCreateMessageCallback(callback) { onSurveyCreateMessageCallback = callback }

function onSurveyCreateMessage(message) {
    let json = JSON.parse(message);
    console.log("New Survey Create Message : " + message)
    if (onSurveyCreateMessageCallback) {
        onSurveyCreateMessageCallback(json)
    }
}

export function voteSurvey(surveyID, optionID) {
    const vote = {
        "surveyID": surveyID,
        "optionID": optionID
    }
    dataChannel.send(encode(messageTypes.surveyVote, JSON.stringify(vote)))
}

export let onSurveyUpdateMessageCallback = undefined

export function setSurveyUpdateMessageCallback(callback) { onSurveyUpdateMessageCallback = callback }

function onSurveyUpdateMessage(message) {
    let json = JSON.parse(message);
    console.log("New Survey Update. Message : " + message)
    if (onSurveyUpdateMessageCallback) {
        onSurveyUpdateMessageCallback(json)
    }
}

export let onSurveyEndMessageCallback = undefined

export function setSurveyEndMessageCallback(callback) { onSurveyEndMessageCallback = callback }

function onSurveyEndMessage(message) {
    let json = JSON.parse(message);
    console.log("New Survey End. Message : " + message)
    
    if (onSurveyEndMessageCallback) {
        onSurveyEndMessageCallback(json.surveyID)
    }
}