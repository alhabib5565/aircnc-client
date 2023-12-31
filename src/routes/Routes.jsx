import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import AddRoom from '../pages/dashboard/AddRoom'
import { aRoom } from '../api/rooms'
import MyBookings from '../pages/dashboard/MyBookings'
import MyListings from '../pages/dashboard/MyListings'
import ManageBookings from '../pages/dashboard/ManageBookings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: (
          <PrivateRoute>
            <RoomDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>aRoom(params.id),
      },

    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/dashboard', element: <DashboardLayout></DashboardLayout>,
    children: [
      {path: '/dashboard', element: <MyBookings></MyBookings>},
      { path: '/dashboard/add-room', element: <AddRoom></AddRoom> },
      {path: '/dashboard/my-bookings', element: <MyBookings></MyBookings>},
      {path: '/dashboard/my-listings', element: <MyListings></MyListings>},
      {path: '/dashboard/manage-bookings', element: <ManageBookings></ManageBookings>}
    ]
  }
])
