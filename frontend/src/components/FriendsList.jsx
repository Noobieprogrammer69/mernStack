// src/components/FriendsList.jsx
import { Box, VStack, Text } from '@chakra-ui/react'

const FriendsList = () => {
  // Dummy data for friends list
  const friends = ['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4']

  return (
    <Box 
      w="full" 
      p={4} 
      bg="gray.100" 
      borderRadius="md" 
      boxShadow="md"
      position="sticky"
      top="20px"
    >
      <Text fontSize="xl" mb={4}>Friends</Text>
      <VStack align="start" spacing={2}>
        {friends.map((friend, index) => (
          <Text key={index}>{friend}</Text>
        ))}
      </VStack>
    </Box>
  )
}

export default FriendsList
