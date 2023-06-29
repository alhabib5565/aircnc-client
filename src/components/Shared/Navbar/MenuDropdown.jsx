import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from './Avatar'
import toast from 'react-hot-toast'
import { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../../../providers/AuthProvider'
import { Link } from 'react-router-dom'
import HostModal from '../../hostModal/HostModal'
import { hostUser } from '../../../api/auth'

const MenuDropdown = () => {
  const { user, logOut,role } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = () => {
    setModalOpen(false)
  }

  const modalHandler = () => {
    hostUser(user)
    .then(data => {
      console.log(data)
      toast.success('You are host naw, post room')
      closeModal()
    })
  }
  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        {/* Aircnc btn */}
        <div className='hidden md:block hover:bg-neutral-100 rounded-full'>
          {!role && 
            <button className='py-3 px-4 transition cursor-pointe text-sm font-semibold ' disabled={!user} onClick={() =>setModalOpen(true)}>AirCNC your home</button>
          }
        </div>
        {/* Dropdown btn */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <AiOutlineMenu />
          <div className='hidden md:block'>
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[15vw] bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            <Link
              to='/'
              className='block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold'
            >
              Home
            </Link>
            {user ? (
              <>
                <div
                  onClick={logOut}
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                >
                  Logout
                </div>
                <Link to='/dashboard' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
                  dahsboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <HostModal email={user?.email} modalHandler={modalHandler} closeModal={closeModal} isOpen={modalOpen}></HostModal>
    </div>
  )
}

export default MenuDropdown
