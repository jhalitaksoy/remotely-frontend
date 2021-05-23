import { post } from '../service/NetworkService';

export function loginUser(loginparameters, callback) {
    post(`/user/login`, loginparameters).then(response => {
        const loginResult = response.data
        storeLoginResult(loginResult)
        callback()
    }).catch(error => {
        if (error.response) {
            if (error.response.status === 409) {
                callback("User or password wrong!")
            }
        } else {
            callback("Network error")
        }
    })
}

export function registerUser(registerparameters, callback) {
    post(`/user/register`, registerparameters).then(response => {
        callback()
    }).catch(error => {
        if (error.response) {
            if (error.response.status === 409) {
                callback("User name already using!")
            }
        } else {
            callback("Network error")
        }
    })
}

const keyjwt = "jwt"
const keyuserid = "user_id"
const keyusername = "user_name"

function storeLoginResult(loginResult) {
    window.localStorage.setItem(keyjwt, loginResult.jwt_token)
    window.localStorage.setItem(keyuserid, loginResult.id)
    window.localStorage.setItem(keyusername, loginResult.name)
}

export function logoutUser() {
    window.localStorage.removeItem(keyjwt)
    window.localStorage.removeItem(keyuserid)
    window.localStorage.removeItem(keyusername)
}

export function jwtKey() {
    const jwt = window.localStorage.getItem(keyjwt)
    return jwt
}

export function currentUser() {
    const id = window.localStorage.getItem(keyuserid)
    const name = window.localStorage.getItem(keyusername)
    return {
        id: id,
        name: name,
    }
}

window.currentUser = currentUser;
window.jwtKey = jwtKey;