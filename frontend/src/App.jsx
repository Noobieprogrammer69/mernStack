import { Box, Container } from '@chakra-ui/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthPage, ChatPage, HomePage, PostPage, UpdateProfilePage, UserPage } from './pages'
import { Header } from './components'
import { useRecoilValue } from 'recoil'
import userAtom from './atoms/userAtom'

function App() {
  const user = useRecoilValue(userAtom)
  const { pathname } = useLocation  ()

  return (
    <Box position="relative" w={"full"}>
      {user && <Header />}
      <Container mt={20} maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"} >
          {/* {user && <Header />} */}
          <Routes>
              <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
              <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

              <Route path="/:username" element={user ? (
                <>
                <UserPage />
                </>
              ) : (
                <UserPage />
              )  
            } 
            />
            <Route path="/:username/post/:pid" element={<PostPage />} />  
            <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/auth" /> } />  
          </Routes>
      </Container>
    </Box>
  )
}

export default App
