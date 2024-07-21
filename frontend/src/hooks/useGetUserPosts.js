import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToast'

const useGetUserPosts = () => {
    const [user, setuser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { username } = useParams()
    const showToast = useShowToast()

    useEffect(() => {
        const getUser = async () => {
            try {
              const res = await fetch(`/api/users/profile/${username}`)
              const data = await res.json()
              if(data.error) {
                showToast("Error", data.error, "error")
              }  
              
              setuser(data)
            } catch (error) {
              showToast("Error", error, "error")
            } finally {
              setLoading(false)
            }
        }
            getUser()
    }, [showToast, username])

    return { loading, user }
}

export default useGetUserPosts