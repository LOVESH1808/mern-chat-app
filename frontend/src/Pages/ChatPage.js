import { Box } from "@chakra-ui/react"
import { useChatState } from "../context/chatProvider"
import SideDrawer from "../components/miscellaneous/SideDrawer"
import MyChats from "../components/MyChats"
import ChatBox from "../components/ChatBox"
import { useState } from "react"

const ChatPage = () => {

    const {user} = useChatState()
    const [fetchAgain, setFetchAgain] = useState()

    // console.log('Current user:', user); 

    return <div style={{width: "100%"}}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
            {user && <MyChats fetchAgain = {fetchAgain} />}
            {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
}

export default ChatPage