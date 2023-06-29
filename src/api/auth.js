
export const saveUser = (user) => {
    const updateUser = {
        email: user.email
    }
    fetch(`http://localhost:5000/users/${user?.email}`, {
        method: "PUT",
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify(updateUser)
    })
    .then(res => res.json())
    .then(data => {
        console.log('auth.js', data)
    })

}


export const hostUser = (user) => {
    const updateUser = {
        role: 'host'
    }
    return fetch(`http://localhost:5000/users/${user?.email}`, {
        method: "PUT",
        headers:{
            'content-type': 'application/json'
        },
        body: JSON.stringify(updateUser)
    })
    .then(res => res.json())
    .then(data => {
        console.log('auth.js add role', data)
    })

}

export const getRole = async(email) => {
    const res =await fetch(`${import.meta.env.VITE_URL}/user/${email}`)
    const data =await res.json()
    return data?.role
}