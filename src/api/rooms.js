

export const addRooms =async (rooms) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/rooms`,{
        method: 'POST',
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify(rooms)
    })
    const data = res.json()
    return data
}

export const allRoom = async() => {
    const res = await fetch(`${import.meta.env.VITE_URL}/rooms`)
    const data = res.json()
    return data
}

export const roomDelete = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/dleteRoom/${id}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    return data
}

/* export const myListingsRome = async (email) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/myListigs/${email}`, {
        headers: {
            authrization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    const data = await res.json()
    return data
} */

export const aRoom =async (id) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/room/${id}`)
    const data = res.json()
    return data
}