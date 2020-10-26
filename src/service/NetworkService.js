import { currentUser } from "../controller/UserController";

const { default: Axios } = require("axios");

export function serverUrl() {
    //return 'http://192.168.43.2:80' 
    //return 'http://127.0.0.1:8080'
    return 'http://34.107.125.219'
}

function headers() {
    const user = currentUser()
    if (user) {
        return { 'userID': user.id }
    }
    return {}
}

//
//route : "/user/login"
//
export function post(route, data) {
    return Axios.post(serverUrl() + route, data, {
        headers: headers()
    })
}