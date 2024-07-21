import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,  
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import usePreviewImage from '../hooks/usePreviewImage'
import useShowToast from '../hooks/useShowToast'
import { useNavigate } from 'react-router-dom'

export default function UpdateProfilePage() {
    const [user, setuser] = useRecoilState(userAtom)
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        password: "",
        bio: user.bio
    })
    const [updating, setUpdating] = useState(false)

    const fileRef = useRef(null)

    const { handleImgChange, imageUrl }= usePreviewImage()
    const showToast = useShowToast()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      if(updating) return
      setUpdating(true)
      try {
        const res = await fetch(`/api/users/update/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({...inputs, avatar:imageUrl})
        })

        const data = await res.json()
        console.log(data)
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "Profile Updated Successfully", "success")
        setuser(data)
        localStorage.setItem("user-threads", JSON.stringify(data))
        navigate(`/${data.username}`)
      } catch (error) {
        showToast("Error", error, "error")
      } finally {
        setUpdating(false)
      }
    }

  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={6}
    >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imageUrl || user.avatar} />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                <Input type='file' hidden ref={fileRef} onChange={handleImgChange}/>
            </Center>

          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            value={inputs.username}
            onChange={(e) => setInputs((inputs) => ({...inputs, username: e.target.value}))}
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            value={inputs.name}
            onChange={(e) => setInputs((inputs) => ({...inputs, name: e.target.value}))}
            placeholder="FullName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            value={inputs.email}
            onChange={(e) => setInputs((inputs) => ({...inputs, email: e.target.value}))}
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            value={inputs.password}
            onChange={(e) => setInputs((inputs) => ({...inputs, password: e.target.value}))}
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            value={inputs.bio}
            onChange={(e) => setInputs((inputs) => ({...inputs, bio: e.target.value}))}
            placeholder="Maximum 200 Characters"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>          
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
            type='submit'
            isLoading={updating}
            >
            Update
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}



