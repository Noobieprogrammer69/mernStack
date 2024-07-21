import { useEffect, useState } from "react"
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions"
import useShowToast from "../hooks/useShowToast"
import { formatDistanceToNow } from "date-fns"
import { DeleteIcon } from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import postsAtom from "../atoms/postsAtom"

const Post = ({ post, postedBy }) => { 
  const [user, setuser] = useState(null)
  const showToast = useShowToast()
  const navigate = useNavigate()
  const currentUser = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)

  useEffect(() => {
    const getUser = async () => {
        try {
            const res = await fetch("/api/users/profile/" + postedBy)
            const data = await res.json()

            if(data.error) {
                showToast("Error", data.error, "error")
                return
            }
            
            setuser(data)
        } catch (error) {
            showToast("Error", error, "error")
            setuser(null)
        }
    }

    getUser()
  }, [postedBy, showToast])

  const handleDeletePost = async (e) => {
    try {
        e.preventDefault()
        if(!window.confirm("Are you sure you want to delete this post?")) return
        
        const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
        })

        const data = await res.json()
        if(data.error) {
            showToast("Error", data.error, "error")
            return
        }

        showToast("Success", "Post Deleted Successfully", "success")
        setPosts(posts.filter((p) => p._id !== post._id))
    } catch (error) {
        showToast("Error", error, "error")
    }
  }

  if(!user) return null

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
        <Box
                bg="rgba(255, 255, 255, 0.1)" 
                backdropFilter="blur(20px)"
                borderRadius="10px"
                p={4}
                mb={4}
        >
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={user.name} src={user.avatar} 
                    onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)
                    }}
                />
                <Box w="1px" h={"full"} bg="white" my={2}></Box>
                <Box position={"relative"} w={"full"}>  
                    {post.replies.length === 0 && <Text textAlign={"center"}>🤷‍♀️</Text>}
                    {post.replies[0] && (
                            <Avatar 
                                size="xs"
                                name={post.replies.username}
                                src={post.replies[0].avatar}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                    )}
                    {post.replies[1] && (
                            <Avatar 
                                size="xs"
                                name={post.replies.username}
                                src={post.replies[1].avatar}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                    )}
                    {post.replies[2] && (
                            <Avatar 
                                size="xs"
                                name={post.replies.username}
                                src={post.replies[2].avatar}
                                position={"absolute"}
                                top={"0px"}
                                left={"15px"}
                                padding={"2px"}
                            />
                    )}
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}
                            onClick={(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`)
                            }}
                        >
                            {user?.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} w={36} textAlign={"right"}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                        
                        { currentUser?._id === user._id && <DeleteIcon cursor={"pointer"} size={20} onClick={handleDeletePost} /> }
                    </Flex>
                </Flex>
                
                <Text fontSize={"sm"}>{post.text}</Text>
                {post.img && (
                    <Box 
                        borderRadius={6}
                        overflow={"hidden"}
                        border={"1px solid"}
                        borderColor={"gray.light"}
                    >
                        <Image src={post.img} w={"full"} />
                    </Box>
                )}
                <Flex gap={3} my={1}>
                    <Actions post={post} />
                </Flex>
            </Flex>
        </Flex>
        </Box>
    </Link>
  )
}

export default Post