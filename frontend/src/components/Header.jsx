import { Button, Flex, Link, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from 'react-router-dom'
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { FiLogOut, FiMenu } from 'react-icons/fi'
import useLogout from '../hooks/useLogout'
import { BsFillChatQuoteFill } from 'react-icons/bs'

const Header = () => {
  const user = useRecoilValue(userAtom)
  const logout = useLogout()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex
      mb={12}
      height="50px"
      width="100%"
      top={0}
      zIndex={1000}
      justifyContent="center"
      alignItems="center"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    >
      <Flex
        width="100%"
        maxWidth="1200px"
        justifyContent={{ base: 'space-between', md: 'center' }}
        alignItems="center"
      >
        <IconButton
          display={{ base: 'block', md: 'none' }}
          icon={<FiMenu />}
          onClick={onOpen}
          aria-label="Open Menu"
        />

        <Flex
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          gap={100}
        >
          {user && (
            <>
              <Link as={RouterLink} to="/">
                <AiFillHome size={30} />
              </Link>
              <Link as={RouterLink} to={`${user.username}`}>
                <RxAvatar size={30} />
              </Link>
              <Link as={RouterLink} to="/chat">
                <BsFillChatQuoteFill size={30} />
              </Link>
              <Button size="xs" onClick={logout}>
                <FiLogOut size={30} />
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              {user && (
                <Flex direction="column" alignItems="flex-start" gap={4}>
                  <Link as={RouterLink} to="/" onClick={onClose}>
                    <AiFillHome size={30} /> Home
                  </Link>
                  <Link as={RouterLink} to={`${user.username}`} onClick={onClose}>
                    <RxAvatar size={30} /> Profile
                  </Link>
                  <Link as={RouterLink} to="/chat" onClick={onClose}>
                    <BsFillChatQuoteFill size={30} /> Chat
                  </Link>
                  <Button size="xs" onClick={() => { logout(); onClose(); }}>
                    <FiLogOut size={30} /> Logout
                  </Button>
                </Flex>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  )
}

export default Header


// import { Button, Flex, Link } from '@chakra-ui/react'
// import { useRecoilValue } from 'recoil'
// import userAtom from '../atoms/userAtom'
// import { Link as RouterLink } from 'react-router-dom'
// import { AiFillHome } from "react-icons/ai"
// import { RxAvatar } from "react-icons/rx"
// import { FiLogOut } from 'react-icons/fi'
// import useLogout from '../hooks/useLogout'
// import { BsFillChatQuoteFill } from 'react-icons/bs'

// const Header = () => {
//   const user = useRecoilValue(userAtom)
 
//   const logout = useLogout()

//   return (
//     <Flex
//     mb={12}
//     height="50px"
//     width="100%"
//     top={0}
//     zIndex={1000}
//     justifyContent="center"
//     alignItems="center"
//     boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
//   >
//     <Flex width="100%" maxWidth="1200px" justifyContent={{ base: 'space-between', md: 'center' }} alignItems="center">       
//       <Flex alignItems="center" gap={100}>
//         {user && (
//           <>
//             <Link as={RouterLink} to="/">
//               <AiFillHome size={30} />
//             </Link>
//             <Link as={RouterLink} to={`${user.username}`}>
//               <RxAvatar size={30} />
//             </Link>
//             <Link as={RouterLink} to="/chat">
//               <BsFillChatQuoteFill size={30} />
//             </Link>
//             <Button size="xs" onClick={logout}>
//               <FiLogOut size={30} />
//             </Button>
//           </>
//         )}
//       </Flex>
//     </Flex>
//   </Flex>
//   )
// }

// export default Header
