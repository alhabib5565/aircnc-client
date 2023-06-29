

export const addBookings = async (rooms) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(rooms)
    })
    const data = res.json()
    return data
}

export const bookingRoom = async (email) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/my-bookings/?email=${email}`)
    const data = await res.json()
    return data
}

export const hostBookingRoom = async (email) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/my-bookings/host/?email=${email}`)
    const data = await res.json()
    return data
}

export const deleteBooking = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/booking/${id}`, {
        method: 'DELETE'
    })
    const data = await res.json()
    return data
}

export const bookingStatus = async (id, status) => {
    const res = await fetch(`${import.meta.env.VITE_URL}/rooms/status/${id}`, {
        method: "PATCH",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ booked: status })
    })
    const data = await res.json()
    return data
}