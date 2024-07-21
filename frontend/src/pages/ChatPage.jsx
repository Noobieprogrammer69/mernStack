import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import { Conversation, MessageContainer } from "../components"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import { useRecoilState, useRecoilValue } from "recoil"
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom"
import { GiConversation } from "react-icons/gi"  
import userAtom from "../atoms/userAtom"
import { useSocket } from "../context/socketContext"

const ChatPage = () => {
    const showToast = useShowToast()
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [search, setSearch] = useState("")
    const [loadingSearch, setLoadingSearch] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const {socket, onlineUsers} = useSocket()

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if(conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true
                            }
                        }
                    }
                    return conversation
                })

                return updatedConversations
            })
        })
    }, [setConversations, socket])

    useEffect(() => {
        const getConversations = async () => {
            
            try {
                const res = await fetch("/api/messages/conversations")
                const data = await res.json()
                if(data.error) {
                    showToast("Error", data.error, "error")
                    return
                }

                setConversations(data)
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false)
            }
        }

        getConversations()
    }, [showToast, setConversations])

    const handleSearchConversation = async (e) => {
        e.preventDefault()
        setLoadingSearch(true)

        try {
            const res = await fetch(`/api/users/profile/${search}`)
            const data = await res.json()

            if(data.error) {
                showToast("Error", data.error, "error")
                return 
            }

            const messageSelf = data._id === currentUser._id

            if(messageSelf) {
                showToast("Error", "You cannot message Yourself", "error")
                return
            }

            const conversationExist = conversations.find(conversation => conversation.recipients[0]._id === data._id)

            if(conversationExist) {
                setSelectedConversation({
                    _id: conversationExist._id,
                    userId: data._id,
                    userAvatar: data.avatar,
                    username: data.username
                })
                return
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: ""
                },
                _id:Date.now(),
                recipients: [
                    {
                        _id: data._id,
                        username: data.username,
                        avatar: data.avatar
                    }
                ]
            }

            setConversations((prevConvs) => [...prevConvs, mockConversation])
            setSearch("")

        } catch (error) {
            showToast("Error", error.message, "error")
        } finally {
            setLoadingSearch(false)
        }

    }

  return (
    <Box position={"absolute"} left={"50%"} transform={"translateX(-50%)"} w={{base: "100%" ,lg: "750px", md: "80%"}} p={4} bg={"gray.dark"} borderRadius={"md"}>
        <Flex gap={4} flexDirection={{base: "column", md: "row"}} maxW={{sm: "400px", md: "full"}} mx={"auto"} >
            <Flex flex={30} gap={2} flexDirection={"column"} maxW={{sm: "250px", md: "full"}} mx={"auto"}>
                <Text fontWeight={700}>Your Messages</Text>
                <form onSubmit={handleSearchConversation} >
                    <Flex alignItems={"center"} gap={2}>
                        <Input placeholder="Search for a User" onChange={(e) => setSearch(e.target.value)} value={search}/>
                        <Button size={"sm"} onClick={handleSearchConversation} isLoading={loadingSearch}>
                            <SearchIcon />
                        </Button>
                    </Flex>
                </form>

                {loading && (
                    [0, 1, 2, 3, 4, 5].map((_, i) => (
                        <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                            <Box>
                                <SkeletonCircle size={10} />
                            </Box>
                            <Flex w={"full"} flexDirection={"column"} gap={3}>
                                <Skeleton h={"10px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90%"} />
                            </Flex>
                        </Flex>
                    ))
                )}
                
                {!loading && (
                    conversations.map((conversation) => (
                        <Conversation key={conversation._id} conversation={conversation} isOnline={onlineUsers.includes(conversation.recipients[0]._id)}  />
                    ))
                )}
            </Flex> 
            {!selectedConversation._id && (
                <Flex flex={70} borderRadius={"md"} p={2} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
                    <GiConversation size={100}/>
                    <Text fontSize={20}>Select A Conversation</Text>
                </Flex>
            )}

            {selectedConversation._id && <MessageContainer />}

        </Flex>
    </Box>
  )
}

export default ChatPage