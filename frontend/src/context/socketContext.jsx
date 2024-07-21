// import { createContext, useEffect, useState } from "react";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { io } from "socket.io-client";
// import { useContext } from "react";

// const SocketContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useSocket = () => {
// 	return useContext(SocketContext);
// };

// const SocketContextProvider = ({ children }) => {
//     const [socket, setsocket] = useState(null);
//     const user = useRecoilValue(userAtom);
//     const [onlineUser, setonlineUser] = useState([])

//     useEffect(() => {
//         if (user && !socket) {
//             const newSocket = io("http://localhost:5000", {
//                 query: {
//                     userId: user._id
//                 },
//                 transports: ['websocket']
//             });

//             setsocket(newSocket);

//             newSocket.on("getonlineusers", (users) => {
//                 setonlineUser(users)
//             });

            
//             newSocket.on("disconnect", () => {
//                 console.log("Disconnected from server", newSocket.id);
//             });
            
//             return () => {
//                 newSocket.close();
//             };
//         }
//     }, [user]);
    
//     console.log(onlineUser)
//     return (
//         <SocketContext.Provider value={{socket, onlineUser}}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export { SocketContextProvider };
// export default SocketContext;

import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
	return useContext(SocketContext);
};


export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

    useEffect(() => {
		const socket = io("http://localhost:5000", {
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		return () => socket && socket.close();
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
}