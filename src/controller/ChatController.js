import { post } from '../service/NetworkService';
import { convertToBytes } from '../util/datachannel_util';
import { messageTypes, dataChannel } from '../controller/StreamController';

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

function onChatMessage(message) {
    let json = JSON.parse(message);
    console.log("New Chat Message : " + message)
    if (onMessageCallback) {
        onMessageCallback(json)
    }
}

export function onMessage(type, message) {
    if (type === messageTypes.chat) {
        onChatMessage(message)
    } else if (type === messageTypes.surveyCreate) {
        onSurveyCreateMessage(message)
    } else if (type === messageTypes.surveyUpdate) {
        onSurveyUpdateMessage(message)
    } else if (type === messageTypes.surveyEnd) {
        onSurveyEndMessage(message)
    } else {
        console.log("Unknown message type : " + type)
    }
}

//Convert object array buffer to string 
//function ab2str(buf) {
//    return String.fromCharCode.apply(null, new Uint8Array(buf));
//}

export function sendChatMessage(message) {
    dataChannel.send(convertToBytes(messageTypes.chat, JSON.stringify(message)))
}

export function createSurvey(survey) {
    dataChannel.send(convertToBytes(messageTypes.surveyCreate, JSON.stringify(survey)))
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
    dataChannel.send(convertToBytes(messageTypes.surveyVote, JSON.stringify(vote)))
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