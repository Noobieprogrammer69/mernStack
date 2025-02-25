import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast"
import { FiLogOut } from "react-icons/fi"
import { Link } from "react-router-dom"


const Logoutbutton = () => {
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()

            if(data.error) {
                showToast("Error", data.error, "error")
            }
            localStorage.removeItem("user-threads")
            setUser(null)
        } catch (error) {
            showToast("Error", error, "error")
        }
    }

  return (
    <Button
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
        onClick={handleLogout}
    >
        <Link to="/auth">
            <FiLogOut size={20} />
        </Link>
    </Button>
  )
}

export default Logoutbutton