import { FirendType, UserType } from "../../Contexts/authContext"


export function send_friend_request(token : string, callback : (data : FirendType) => void , data : UserType) {
    fetch('http://localhost:8000/api/friends/new_relation/', {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify({data : data})
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            callback(data.res)
        }
    })
    .catch(err => console.log(err))
}

export function accept_friend_request(token : string, callback : (id : Number) => void  | null , data : UserType) {
    fetch('http://localhost:8000/api/friends/accept_friend/', {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify({data : data})
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if (data.status == 200) {
            callback(data.message.id)
        }
    })
    .catch(err => console.log(err))
}

export function reject_friend_request(token : string, callback : (id : Number) => void , data : UserType) {
    fetch('http://localhost:8000/api/friends/reject_friend/', {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify({data : data})
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            callback(data.id)
        }
    })
    .catch(err => console.log(err))
}

export function cancle_friend_request(token : string, callback : (id : Number) => void , data : UserType) {
    fetch('http://localhost:8000/api/friends/cancle_friend/', {
        method : 'POST',
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify({data : data})
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 200) {
            callback(data.id)
        }
    })
    .catch(err => console.log(err))
}