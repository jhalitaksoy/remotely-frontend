//
import { post } from '../service/NetworkService';
// user.name 
//
export function loginUser(user, callback) {
    post(`/user/login`, user).then(response => {
        const userID = response.data
        window.localStorage.setItem("userID", userID)
        callback()
    }).catch(error => {
        if (error.response) {
            if (error.response.status === 404) {
                callback("User or password wrong!")
            }
        } else {
            callback("Network error")
        }

    })
}

export function registerUser(user, callback) {
    post(`/user/register`, user).then(response => {
        //const userID = response.data
        callback()
    }).catch(error => {
        if (error.response) {
            if (error.response.status === 409) {
                callback("User name already using :(. Try new one.")
            }
        } else {
            callback("Network error")
        }
    })
}

export function logoutUser() {
    window.localStorage.removeItem("userID")
}

export function currentUser() {
    const userID = window.localStorage.getItem("userID")
    if (userID) {
        return { id: userID }
    }
}

window.currentUser = currentUser;

export const loginRedirect = {
    afterLogin: undefined,
    onGotoLogin: () => {
        console.log("a");
    }

}