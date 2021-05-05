
import { post } from '../service/NetworkService';
export function createRoom(room, callback) {
    post("/room/create", room)
        .then((response) => {
            callback()
        }).catch((error) => {
            console.log({error})
            callback(undefined,"Error!")
        })
}


export function joinRoom(id, callback) {
    post(`/room/join/${id}`, "")
    .then((response) => {
        callback()
    }).catch((error) => {
        console.log({error})
        callback(undefined,"Error!")
    })
}

export function listRooms(callback) {
    post(`/room/listRooms`, "")
    .then((response) => {
        callback(response.data)
    }).catch((error) => {
        console.log({error})
        callback(undefined,"Error!")
    })
}

export function getRoom(id, callback) {
    post(`/room/get/${id}`, "")
    .then((response) => {
        callback(response.data)
    }).catch((error) => {
        console.log({error})
        callback(undefined,"Error!")
    })
}