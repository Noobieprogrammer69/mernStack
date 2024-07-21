import { useEffect, useState } from 'react'
import { Post, UserHeader } from '../components'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import useGetUserPosts from '../hooks/useGetUserPosts'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const UserPage = () => {
  const { user, loading } = useGetUserPosts()
  const { username } = useParams()
  const showToast = useShowToast()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetching(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`)
        const data = await res.json()

        if (Array.isArray(data)) {
          setPosts(data)
        } else {
          showToast("Error", "Invalid posts data format", "error")
          setPosts([])
        }
      } catch (error) {
        showToast("Error", error, "error")
        setPosts([])
      } finally {
        setFetching(false)
      }
    } 

    getPosts()

  }, [username, showToast, setPosts, user])
  
  if(!user && loading) {
    return (
      <Flex justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    )
  } 

  if(!user && !loading) return <h1>User not found</h1>

  return (
    <>
      <UserHeader user={user} />
      {!fetching && posts.length === 0 && <Text>User has no posts.</Text>}
      {fetching && (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      )}

      {/* {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))} */}
      {Array.isArray(posts) && posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default UserPage
