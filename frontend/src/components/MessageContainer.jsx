import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import { Message, MessageInput } from "./index"
import { useEffect, useRef, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import { useSocket } from "../context/socketContext"

const MessageContainer = () => {
    const showToast = useShowToast()
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const currentUser = useRecoilValue(userAtom)
    const { socket } = useSocket()
    const setConversations = useSetRecoilState(conversationsAtom)
    const messageRef = useRef(null)

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if(selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message])
            }

            setConversations((prevConversations) => {
                const updatedConversations = prevConversations.map(conversation => {
                    if(conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender
                            }
                        }
                    }

                    return conversation
                })

                return updatedConversations
            })
        })
        
        return () => socket.off("newMessage")
    }, [selectedConversation._id, setConversations, socket])

    useEffect(() => {   
        const lastMessageIsFromOther = messages.length && messages[messages.length - 1].sender !== currentUser._id

        if(lastMessageIsFromOther) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId
            })
        }

        socket.on("messagesSeen", ({ conversationId }) => {
            if(selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if(!message.seen) {
                            return {
                                ...message,
                                seen: true
                            }
                        }

                        return message
                    })

                    return updatedMessages
                })
            }
        })
    }, [currentUser._id, messages, selectedConversation._id, selectedConversation.userId, socket])

    useEffect(() => {
		messageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            setMessages([])

            try {
                if(selectedConversation.mock) return
                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
                const data = await res.json()
                if(data.error) {
                    showToast("Error", data.error, "error")
                    return
                }

                setMessages(data)
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false)
            }
        }

        getMessages()

    }, [selectedConversation.mock, selectedConversation.userId, showToast])

  return (
    <Flex flex={"70"} bg={"gray.dark"} borderRadius={"md"} flexDirection={"column"} p={2}>
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
            <Avatar src={selectedConversation.userAvatar} size={"sm"} />
            <Text display={"flex"} alignItems={"center"}>
                {selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
            </Text>
        </Flex>

        <Divider />

        <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
        {loading && 
            [...Array(5)].map((_, i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                                <Skeleton h={"8px"} w={"250px"} />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))}

                    {!loading && (
                        messages.map((message) => (
                            <Flex 
                            key={message._id}
                            direction={"column"}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageRef : null}
                            >
                                <Message message={message} ownMessage={currentUser._id === message.sender} />
                            </Flex>
                        ))
                    )}

        </Flex>
                    <MessageInput setMessages={setMessages} />
    </Flex>
  )
}

export default MessageContainer