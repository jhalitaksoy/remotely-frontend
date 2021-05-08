import { Box, Button, Card, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { loginUser, registerUser } from '../controller/UserController';
import { useHistory } from "react-router-dom";

function LoginPage(props) {

    const history = useHistory();

    const [userName, setUserName] = useState("")
    const [userPass, setUserPass] = useState("")
    const [loginError, setLoginError] = useState()

    const onLoginClick = () => {
        if (!userName) {
            setLoginError("User name cannot be blank!")
            return
        }
        if (!userPass) {
            setLoginError("User password cannot be blank!")
            return
        }

        const loginParameters = {
            Name: userName,
            Password: userPass,
        }

        loginUser(loginParameters, (error) => {
            if (error) {
                setLoginError(error)
            } else {
                history.replace("/")
            }
        })
    }

    const gotoRegister = () => {
        history.replace("/register")
    }

    return (
        <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Card>
                <div style={{ padding: '20px', width: 'fit-content' }}>
                    <Box display="flex" flexDirection="column">
                        <Box alignSelf="flex-start" marginBottom="10px" >
                            <Typography variant="h5">
                                User Login
                        </Typography>
                        </Box>

                        {loginError && <Box alignSelf="flex-start" marginBottom="10px">
                            <Typography variant="body2" color="red">
                                {loginError}
                            </Typography>
                        </Box>
                        }

                        <Box style={{ padding: '5px 0px' }}>
                            <TextField
                                label="User Name"
                                variant="outlined"
                                onChange={e => setUserName(e.target.value)} />
                        </Box>
                        <Box style={{ padding: '5px 0px' }}>
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                onChange={e => setUserPass(e.target.value)} />
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignSelf="stretch" marginTop="10px">
                            <Button color="primary" onClick={gotoRegister}>
                                Register
                        </Button>
                            <Button variant="contained" color="primary" onClick={onLoginClick}>
                                Login
                        </Button>
                        </Box>
                    </Box>
                </div>

            </Card>
        </div>
    )
}
export default LoginPage