import { Box, Button, CloseButton, Flex, FormControl, Image, Input, Text, Textarea, useDisclosure } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import usePreviewImage from '../hooks/usePreviewImage'
import { BsFillImageFill } from 'react-icons/bs'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const MAX_CHAR = 500

const CreatePost = () => {
    const { onClose } = useDisclosure()
    const [postText, setPostText] = useState("")
    const imageRef = useRef(null)
    const { handleImgChange, imageUrl, setImageUrl }= usePreviewImage()
    const [remChar, setRemChar] = useState(MAX_CHAR)
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useRecoilState(postsAtom);

    const handleTextChange = (e) => {
        const inputText = e.target.value

        if(inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR)
            setPostText(truncatedText)
            setRemChar(0)
        } else {
            setPostText(inputText)
            setRemChar(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async () => {
        setLoading(true);
      
        try {
          const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postedBy: user._id, text: postText, img: imageUrl }),
          });
      
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
 
          setPosts([data, ...posts]);
      
          showToast("Success", "Post created Successfully", "success");
          onClose();
          setPostText("");
          setImageUrl("");
        } catch (error) {
          showToast("Error", error.message || "Failed to create post", "error");
        } finally {
          setLoading(false);
        }
      };

  return (
    <Flex justifyContent={"center"} >
      <Box
        bg="rgba(255, 255, 255, 0.1)" 
        backdropFilter="blur(20px)"
        borderRadius="10px"
        p={4}
        mb={4}
        w={"full"}
      >
      <Text textAlign={"center"} mb={5}>Post here</Text>
      <FormControl>
                <Textarea 
                    placeholder='What&apos;s on your mind...'
                    onChange={handleTextChange}
                    value={postText}
                />
                <Text fontSize={"xs"} fontWeight="bold" textAlign={"right"} m={"1"} color={"white"}>{remChar}/{MAX_CHAR}</Text>
                <Input 
                    type='file'
                    hidden
                    ref={imageRef}
                    onChange={handleImgChange}
                />

                <BsFillImageFill style={{marginLeft: "5px", cursor: "pointer"}} size={16} onClick={() => imageRef.current.click()} />
            </FormControl>
            {imageUrl && (
              <Flex mt={5} w={"full"} justifyContent="center">
                  <Box position="relative">
                      <Image src={imageUrl} alt="selectedImg" />
                      <CloseButton onClick={() => setImageUrl("")} bg={"gray.800"} position={"absolute"} top={2} right={2} />
                  </Box>
              </Flex>
            )}
            <Flex justifyContent={"center"}>
              <Button colorScheme='blue' mt={5} onClick={handleCreatePost} isLoading={loading}>
                Post
              </Button>
            </Flex>
      </Box>
    </Flex>
  )
}

export default CreatePost

