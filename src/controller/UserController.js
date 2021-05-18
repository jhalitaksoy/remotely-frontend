//
import { post } from '../service/NetworkService';
// user.name 
//
export function loginUser(loginparameters, callback) {
    post(`/user/login`, loginparameters).then(response => {
        const jwt = response.data
        window.localStorage.setItem("jwt", jwt)
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

export function logoutUser() {
    window.localStorage.removeItem("jwt")
}

export function jwtKey() {
    const jwt = window.localStorage.getItem("jwt")
   return jwt
}

window.currentUser = jwtKey;

window.jwtKey = jwtKey;