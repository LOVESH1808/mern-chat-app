import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useNavigate()

    const handleClickPassword = () => setShowPassword(!showPassword)

    const handleClickConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

    const postDetails = (pics) => {
        setLoading(true)
        if(pics === undefined) {
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            return
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "da7f1yhho")
            fetch("https://api.cloudinary.com/v1_1/da7f1yhho/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json()).then((data) =>{
                setPic(data.url.toString())
                // console.log(data.url.toString());
                setLoading(false)
            }).catch((err) => {
                // console.log(err)
                setLoading(false)
            })
        } else {
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return
        }
        if(password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return
        }

        try {
            const config = {
                headers : {
                    "Content-type" : "application/json",
                }
            }
            const { data } = await axios.post("api/user", {name, email, password, pic}, config)
            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            // console.log(data)
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            history("/chats")

        } catch(err) {
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
        }
    }




  return (
    <VStack spacing='5px'>
        <FormControl id = "first-name" isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input 
                placeholder = "Enter your Name"
                onChange = {(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id = "email" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input 
                placeholder = "Enter your email"
                onChange = {(e) => setEmail(e.target.value)}
            />
        </FormControl>
        
        <FormControl id = "password" isRequired>
            <FormLabel>
                    Password
            </FormLabel>
            <InputGroup>
                <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder = "Enter your password"
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h = "1.75rem" size="sm" onClick={handleClickPassword} bg={"lightcyan"}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>


        <FormControl id = "password" isRequired>
            <FormLabel>
                    Confirm Password
            </FormLabel>
            <InputGroup>
                <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder = "Enter your password"
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h = "1.75rem" size="sm" onClick={handleClickConfirmPassword} bg={"lightcyan"}>
                        {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id = "pic">
            <FormLabel>Upload your profile pic</FormLabel>
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button bgColor='powderblue'
            width='100%'
            color={'black'}
            style={{marginTop : 15}}
            onClick={submitHandler}
            isLoading = {loading}
        >
            Sign Up
        </Button>

    </VStack>
  )
}

export default Signup