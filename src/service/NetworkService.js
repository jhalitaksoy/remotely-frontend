import { jwtKey, logoutUser } from "../controller/UserController";

const { default: Axios } = require("axios");

export function serverUrl() {
    //return 'http://192.168.43.2:80' 
    //return 'http://127.0.0.1:8080'
    //return 'https://34.107.125.219'
    return 'https://segin.one/remotely-backend'
}

export function wsServerUrl() {
    //return 'ws://192.168.43.2:80' 
    //return 'ws://127.0.0.1:8080'
    //return 'ws://34.107.125.219'
    return 'wss://segin.one/remotely-backend'
}


function headers() {
    const jwt = jwtKey()
    if (jwt) {
        return { 'Authorization': "Bearer " + jwt }
    }
    return {}
}

//
//route : "/user/login"
//
export function post(route, data) {
    return new Promise(function(resolve, reject) {
        Axios.post(serverUrl() + route, data, {
            headers: headers()
        }).then((response)=> {
            resolve(response)
        }).catch((error)=>{
            if (error.response) {
                if(error.response.status === 401){
                    logoutUser()
                    window.onUnAuth()
                    return
                }
            }
            reject(error)
        })
     });
}