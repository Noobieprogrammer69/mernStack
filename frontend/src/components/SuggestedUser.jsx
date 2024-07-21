/* eslint-disable no-mixed-spaces-and-tabs */
import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"

const SuggestedUser = ({ user }) => {
	const currentUser = useRecoilValue(userAtom)
	const [following, setFollowing] = useState(false)
	const [updating, setUpdating] = useState(false)
	const showToast = useShowToast()
	
  
	useEffect(() => {
	  if (user && Array.isArray(user.followers)) {
		  setFollowing(user.followers.includes(currentUser?._id));
	  }
	}, [user, currentUser]);

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
    <>
    	<Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user?.username}`}>
				<Avatar src={user.avatar} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"white"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
    </>
  )
}

export default SuggestedUser