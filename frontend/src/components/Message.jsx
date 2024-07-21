import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messageAtom"
import userAtom from "../atoms/userAtom"
import { BsCheck2All } from "react-icons/bs"
import { useState } from "react"

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const user = useRecoilValue(userAtom)
  const [imageLoad, setImageLoad] = useState(false)

  return (
    <>
        {ownMessage ? (
            <Flex gap={2} alignSelf={"flex-end"}>
              {message.text && (
                <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                  <Text color={"white"}>{message.text}</Text>
                  <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                    <BsCheck2All size={16} />
                  </Box>
                </Flex>
              )}
              {message.image && !imageLoad && (
                <Flex mt={5} w={"200px"}>
                  <Image src={message.image} hidden onLoad={() => setImageLoad(true)} alt="message Image" borderRadius={4} />
                    <Skeleton width={"200px"} h={"200px"} />
                </Flex>
              )}

              {message.image && imageLoad && (
                <Flex mt={5} w={"200px"}>
                  <Image src={message.image} alt="message Image" borderRadius={4} />
                  <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                    <BsCheck2All size={16} />
                  </Box>
                </Flex>
              )}
                <Avatar src={user.avatar} w={7} h={7}  />
            </Flex>
        ) : (
            <Flex gap={2}>
                <Avatar src={selectedConversation.userAvatar} w={7} h={7}  />
              {message.text && (
                <Text maxW={"350px"} bg={"gray.400"} color={"black"} p={1} borderRadius={"md"}>{message.text}</Text>
              )}
              {message.image && !imageLoad && (
                <Flex mt={5} w={"200px"}>
                  <Image src={message.image} hidden onLoad={() => setImageLoad(true)} alt="message Image" borderRadius={4} />
                    <Skeleton width={"200px"} h={"200px"} />
                </Flex>
              )}
              {message.image && imageLoad && (
                <Flex mt={5} w={"200px"}>
                  <Image src={message.image} alt="message Image" borderRadius={4} />
                </Flex>
              )}
        </Flex> 
        )}

    </>
  )
}

export default Message