import { createContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import { getRole } from '../api/auth'
import axios from 'axios';

export const AuthContext = createContext(null)

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState()

  useEffect(() => {
    if (user && user?.email) {
      getRole(user?.email)
        .then(data => {
          setRole(data)
        })
    }
  }, [user])

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const resetPassword = email => {
    setLoading(true)
    return sendPasswordResetEmail(auth, email)
  }

  const logOut = () => {
    setLoading(true)
    localStorage.removeItem('access_token')
    return signOut(auth)
  }

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      console.log('current user', currentUser)

      if (currentUser.email) {
        axios.post(`${import.meta.env.VITE_URL}/jwt`, {
          email: currentUser?.email
        })
          .then(data => {
            console.log(data)
            localStorage.setItem('access_token', data.data.token)
            setLoading(false)
          })
      } else {
        localStorage.removeItem('access_token')
        setLoading(false)
      }
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  const authInfo = {
    user,
    role,
    loading,
    setRole,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
