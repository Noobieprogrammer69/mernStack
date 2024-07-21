import { useRecoilValue } from "recoil"
import { LoginCard, SignupCard } from "../components"
import authScreenAtom from "../atoms/authAtom"


const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)
    console.log(authScreenState)
  return (
    <>
        {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </>
  )
}

export default AuthPage