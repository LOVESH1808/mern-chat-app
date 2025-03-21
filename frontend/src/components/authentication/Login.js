import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'




const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)
  const handleClickPassword = () => setShowPassword(!showPassword)
  const history = useNavigate()
  const toast = useToast()
  const submitHandler = async() => {
    setLoading(true)
    if(!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        }
      }
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      )
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
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
          position: 'bottom',
        })
        setLoading(false)
    }
  }

  return (
    <VStack spacing='5px'>
        <FormControl id = "email" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input 
                placeholder = "Enter your email"
                value={email}
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
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h = "1.75rem" size="sm" onClick={handleClickPassword} bg={"lightcyan"}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <Button bgColor='powderblue'
            width='100%'
            color={'black'}
            style={{marginTop : 15}}
            onClick={submitHandler}
        >
          Login
        </Button>

        <Button
          bgColor='teal'
          width='100%'
          color={'black'}
          isLoading = {loading}
          onClick={() => {
            // console.log("Button clicked");
            // console.log("Current email:", email);
            // console.log("Current password:", password);
            setEmail("guest@example.com");
            setPassword("123456");
            // console.log("new email:", email);
            // console.log("new password:", password);
          }}
        >Get Guest user Credentials</Button>

    </VStack>
  )
}

export default Login