import React, { useContext, useState } from 'react'
import Calender from '../Rooms/Calender'
import Button from '../Button/Button'
import BookingModal from '../hostModal/BookingModal'
import { formatDistance } from 'date-fns'
import { AuthContext } from '../../providers/AuthProvider'
import { addBookings, bookingStatus } from '../../api/bookings'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const RoomReservation = ({ roomData }) => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }
  const [value, setValue] = useState({
    startDate: new Date(roomData?.from),
    endDate: new Date(roomData?.to),
    key: 'selection',
  })

  const price = roomData.price
  const totalPrice = formatDistance(new Date(roomData.to), new Date(roomData.from)).split(' ')[0] * price
  const bookingInfo = {
    price: totalPrice,
    guest: { name: user.displayName, email: user.email, image: user.photoURL },
    host: roomData.host.email,
    location: roomData.location,
    to: value.endDate,
    from: value.startDate,
    title: roomData.title,
    roomId: roomData._id,
    image: roomData.image,
  }

  const handleSelect = () => {
    setValue({ ...value })
  }
  return (
    <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
      <div className='flex flex-row items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {price}</div>
        <div className='font-light text-neutral-600'>night</div>
      </div>
      <hr />
      <Calender handleSelect={handleSelect} value={value} />
      <hr />
      <div onClick={() => setIsOpen(true)} className='p-4'>
        <Button disabled={user.email === roomData.host.email || roomData.booked} label='Reserve' />
      </div>
      <hr />
      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
      <BookingModal bookingInfo={bookingInfo} closeModal={closeModal} isOpen={isOpen}></BookingModal>
    </div>
  )
}

export default RoomReservation
