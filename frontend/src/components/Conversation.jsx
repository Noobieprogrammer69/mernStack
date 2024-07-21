import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { selectedConversationAtom } from "../atoms/messageAtom"
import { BsCheck2All, BsImageFill } from "react-icons/bs"

const Conversation = ({conversation, isOnline}) => {
    const user = conversation.recipients[0]
    const lastMessage = conversation.lastMessage
    const currentUser = useRecoilValue(userAtom)
    const [selectedConversation, setselectedConversation] = useRecoilState(selectedConversationAtom)

  return (
    <Flex gap={4} alignItems={"center"} p={1} _hover={{cursor: "pointer", color: "white", bg: "gray.dark"}} borderRadius={"md"} onClick={() => setselectedConversation({
        _id: conversation._id,
        userId: user._id,
        userAvatar: user.avatar,
        username: user.username,
        mock: conversation.mock
    })}
    bg={selectedConversation?._id === conversation._id ? "gray.800" : ""}   
    >
        <WrapItem>
            <Avatar size={{base: "xs", sm: "sm", md: "md"}} src={user.avatar}>
                {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
            </Avatar>
        </WrapItem>
        <Stack direction={"column"} fontSize={"sm"}>
            <Text fontWeight={700} display={"flex"} alignItems={"center"}>
                {user.username} <Image src="/verified.png" w={4} h={4} ml={1}/>
            </Text>
            <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                {currentUser._id === lastMessage.sender ? (
                    <Box color={lastMessage.seen ? "blue.400" : ""}>
                        <BsCheck2All size={16} />
                    </Box>
                ) : ""}
                {lastMessage.text.length > 20 ? lastMessage.text.substring(0, 20) + "..." : lastMessage.text || <BsImageFill size={16} />}
            </Text>
        </Stack>
    </Flex>
  )
}

export default Conversation