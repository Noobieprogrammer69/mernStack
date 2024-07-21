'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthState  = useSetRecoilState(authScreenAtom)
  const [loading, setLoading] = useState(false)
  const [inputs, setinputs] = useState({
    email: "",
    password: ""
  })
  const setUser = useSetRecoilState(userAtom)

  const showToast = useShowToast()
  
  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputs)
      })
      
      const data = await res.json()
      
      if(data.error) {
        showToast("Error", data.error, "error")
        return
      }

      localStorage.setItem("user-threads", JSON.stringify(data))
      setUser(data)
      console.log(data)
    } catch (error) {
      showToast("Error", error, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} mt={10}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}
          w={{
            base: "full",
            sm: "400px"
            }}
          bg="rgba(255, 255, 255, 0.1)" 
          backdropFilter="blur(20px)"
          borderRadius="10px"
          mb={4}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setinputs((inputs) => ({...inputs, email: e.target.value}))} value={inputs.email} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setinputs((inputs) => ({...inputs, password: e.target.value}))} value={inputs.password}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.8 00"),
                }} onClick={handleLogin} isLoading={loading}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link color={'blue.400'} onClick={() => setAuthState("signup")}>Sign up here</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}