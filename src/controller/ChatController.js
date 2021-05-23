import { post } from '../service/NetworkService';
import { decodeText, encodeText } from '../util/byte_util';

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
    const bytes = encodeText(json)
    window.rtmt.sendMessage(ChannelChat,bytes)
}

export function listenChatMessage(callback){
    window.rtmt.listenMessage(ChannelChat, (message)=>{
        const json = decodeText(message)
        const chatMessage = JSON.parse(json)
        callback(chatMessage)
    })
}

/// survey

const ChannelSurveyCreate = "survey_create"
const ChannelSurveyDestroy = "survey_destroy"
const ChannelSurveyUpdate  = "survey_update"
const ChannelSurveyVote    = "survey_vote"

export function createSurvey(survey){
    const json = JSON.stringify(survey)
    const bytes = encodeText(json)
    window.rtmt.sendMessage(ChannelSurveyCreate,bytes)
}

export function voteSurvey(surveyID, optionID) {
    const vote = {
        "surveyID": surveyID,
        "optionID": optionID
    }
    const json = JSON.stringify(vote)
    const bytes = encodeText(json)
    window.rtmt.sendMessage(ChannelSurveyVote,bytes)
}

export function listenOnSurveyCreate(callback) {
    window.rtmt.listenMessage(ChannelSurveyCreate, (bytes)=>{
        const json = decodeText(bytes)
        const survey = JSON.parse(json)
        callback(survey)
    })
}

export function listenOnSurveyDestroy(callback) {
    window.rtmt.listenMessage(ChannelSurveyDestroy, (bytes)=>{
        const json = decodeText(bytes)
        const survey = JSON.parse(json)
        callback(survey.surveyID)
    })
}

export function listenOnSurveyUpdate(callback) {
    window.rtmt.listenMessage(ChannelSurveyUpdate, (bytes)=>{
        const json = decodeText(bytes)
        const survey = JSON.parse(json)
        callback(survey)
    })
}
