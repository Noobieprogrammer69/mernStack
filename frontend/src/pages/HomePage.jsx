import { Box, Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import Post from "../components/Post"
import { useRecoilState, useRecoilValue } from "recoil"
import postsAtom from "../atoms/postsAtom"
import { CreatePost, SuggestedUsers } from "../components"
import userAtom from "../atoms/userAtom"

const HomePage = () => {
  const showToast = useShowToast()
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(false)
  const user = useRecoilValue(userAtom)

  useEffect(() => {
		const getPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/allPosts");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}

				setPosts(data.allPosts);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getPosts();
	}, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {loading && (
          <Flex justify="center">
            <Spinner size="xl"/>
          </Flex>
        )}
        {!loading && user && <CreatePost />}
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))
        ) : (
          !loading && (
            <Flex justify="center">
              <p>No posts available</p>
            </Flex>
          )
        )}
      </Box>
      <Box flex={30} display={{base: "none", md: "block"}}>
        <SuggestedUsers />
      </Box>
    </Flex>
    // <>
    //   {loading && (
    //       <Flex justify="center">
    //         <Spinner size="xl"/>
    //       </Flex>
    //     )}
    //     {!loading && user && <CreatePost />}
    //     {Array.isArray(posts) && posts.length > 0 ? (
    //       posts.map((post) => (
    //         <Post key={post._id} post={post} postedBy={post.postedBy} />
    //       ))
    //     ) : (
    //       !loading && (
    //         <Flex justify="center">
    //           <p>No posts available</p>
    //         </Flex>
    //       )
    //     )}
    // </>
  )
}

export default HomePage

