import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {SearchIcon, BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { useChatState } from '../../context/chatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const {user, setSelectedChat, chats, setChats, notification, setNotification} = useChatState()
    const history = useNavigate()
    const {isOpen, onOpen, onClose} = useDisclosure()
    
    const toast = useToast()

    const handleSearch = async () => {
        if(!search) {
            toast({
                title: "Please enter something to search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top-left',
            })
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`, config)

            setLoading(false)
            setSearchResult(data)
        } catch(err) {
            toast({
                title: "Error Occured",
                description: "Failed to Load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    const accessChat = async (userId) => {
        // console.log(userId)
        try {
            const config = {
                headers : {
                    "Content-type" : "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
    
            const {data} = await axios.post("/api/chat", {userId}, config)
            
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch(err) {
            toast({
                title:"Error fetching the chat",
                description: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }

    }

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history("/")
    }
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"    
            >
                <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                    {/* <i class="fa-brands fa-researchgate"></i> */}
                    <SearchIcon />
                    <Text display={{base:"none", md:"flex"}} px="4" >
                        Search User
                    </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Chat-App
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge 
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m="1" />
                        </MenuButton>
                        <MenuList pl={3}>
                            {!notification.length && "No new Messages"}
                            {notification.map((notif) =>(
                                <MenuItem key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat)
                                    setNotification(notification.filter((n) => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat
                                        ? `New message in ${notif.chat.chatName}`
                                        : `New message from ${getSender(user, notif.chat.users)}`
                                    }
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton 
                            as={Button}
                            rightIcon={<ChevronDownIcon />}    
                        >
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user = {user}>
                            <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                    <Box display="flex" pb={2}>
                        <Input
                            placeholder='Search by name or Email'
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button 
                        onClick={handleSearch}
                        >Go</Button>
                    </Box>
                    {loading ? (
                        <ChatLoading />
                    ):
                    (
                        searchResult?.map(user => (
                            <UserListItem 
                                key = {user._id}
                                user = {user}
                                handleFunction = {() => accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
                
            </Drawer>

        </>
    )
}

export default SideDrawer