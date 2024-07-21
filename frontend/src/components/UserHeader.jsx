import { Avatar, Box, Button, Flex, Link, Text, VStack } from '@chakra-ui/react'
import { CgMoreO } from 'react-icons/cg'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'

const UserHeader = ({ user }) => {
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom)
  const [following, setFollowing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const showToast = useShowToast()
  

  useEffect(() => {
    if (user && Array.isArray(user.followers)) {
        setFollowing(user.followers.includes(currentUser?._id));
    }
  }, [user, currentUser]);

  const copyURL = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(() => {
        toast({description: "Profile Link copied to Clipboard", status: 'success', isClosable: true})
    })
  }

//   const handleFollow = async () => {
//     try {
//         const res = await fetch(`/api/users/follow/${user._id}`, {
//             method: "POST",
//             headers: {
//                "Content-Type": "application/json"
//             }
//         })

//         const data = await res.json()

//         if(data.error) {
//             showToast("Error", data.error, "error")
//             return
//         }

//         if(following) {
//             showToast("Success", `Unfollowed ${user.name}`, "Success")
//             user.followers.pop()
//         } else {
//             showToast("Success", `followed ${user.name}`, "Success")
//             user.followers.push(currentUser._id)
//         }

        

//         setFollowing(!following)
//     } catch (error) {
//         showToast("Error", error, "error")
//     }
//   }

const handleFollow = async () => {
    if(!currentUser) {
        showToast("Error", "Please Login To Follow A User", "error");
            return;
    }
    if(updating) return
    setUpdating(true)
    try {
        const res = await fetch(`/api/users/follow/${user._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (data.error) {
            showToast("Error", data.error, "error");
            return;
        }

        if (following) {
            showToast("Success", `Unfollowed ${user.name}`, "success");
            if (user.followers && Array.isArray(user.followers)) {
                user.followers.pop();
            } else {
                console.error("user.followers is not an array:", user.followers);
            }
        } else {
            showToast("Success", `Followed ${user.name}`, "success");
            if (user.followers && Array.isArray(user.followers)) {
                user.followers.push(currentUser?._id);
            } else {
                console.error("user.followers is not an array:", user.followers);
            }
        }

        setFollowing(!following);
    } catch (error) {
        showToast("Error", error.toString(), "error");
    } finally {
        setUpdating(false)
    }
};

  return (
    <VStack gap={4} alignItems={"start"} bg="rgba(255, 255, 255, 0.1)" 
    backdropFilter="blur(20px)"
    borderRadius="10px"
    p={4}
    mb={4}
    w={"full"}>
        <Flex justifyContent={"space-between"} w={"full"} >
            <Box>
                <Text fontSize={"2xl"}>
                    {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>{user.username}</Text>
                </Flex>
            </Box>
            <Box>
            {user.avatar && (
                    <Avatar 
                        name={user.name}
                        src={user.avatar}
                        size={{
                            base: "md",
                            md: "xl"
                        }}
                    />
                )}

            {!user.avatar && (
                    <Avatar 
                        name={user.name}
                        src='https://bit.ly/broken-link'
                        size={{
                            base: "md",
                            md: "xl"
                        }}
                    />
                )}
            </Box>
        </Flex>

        <Text>{user.bio}</Text>

        { currentUser?._id === user._id && (
            <Link as={RouterLink} to={"/update"}>
                <Button size="md">Update Profile</Button>        
            </Link>
        )}
        { currentUser?._id !== user._id && (
                <Button size="md" onClick={handleFollow} isLoading={updating} bg={following ? "blue.500" : "gray.300"} _hover={{ bg: following ? "blue.600" : "gray.400" }}
                color={following ? "white" : "black"}>{following ? "Unfollow" : "Follow"}</Button>
        ) }
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text>{user.followers ? user.followers.length : 0} Followers</Text>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"} />
                        </MenuButton>
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
        </Flex>

        <Flex w={"full"} pb={5}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Posts</Text>
            </Flex>
            {/* <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex> */}
        </Flex>
    </VStack>
  )
}

export default UserHeader
