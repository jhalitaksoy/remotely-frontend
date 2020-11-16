import { post } from '../service/NetworkService';

export function getChat(roomid, callback) {
    post(`/room/chat/${roomid}`, "")
    .then((response) => {
        callback(response.data)
    }).catch((error) => {
        console.log({error})
        callback(undefined,"Error!")
    })
}
