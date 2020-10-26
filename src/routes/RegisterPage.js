import { Box, Button, Card, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { registerUser, loginUser } from '../controller/UserController';
import { useHistory } from "react-router-dom";

function RegisterPage(props) {

    const history = useHistory();

    const [userName, setUserName] = useState("")
    const [userPass, setUserPass] = useState("")
    const [userPass2, setUserPass2] = useState("")
    const [loginError, setLoginError] = useState()


    const onRegisterClick = () => {
        if (!userName) {
            setLoginError("User name cannot be blank!")
            return
        }
        if (!userPass) {
            setLoginError("User password cannot be blank!")
            return
        }
        if (!userPass2) {
            setLoginError("User password cannot be blank!")
            return
        }

        if (userPass !== userPass2) {
            setLoginError("User passwords not eqaul!")
            return
        }

        const user = {
            Name: userName,
            Password: userPass
        }
        registerUser(user, (error) => {
            if (error) {
                setLoginError(error)
            } else {
                loginUser(user, (error) => {
                    if (error) {
                        history.replace("/login")
                    } else {
                        history.replace("/")
                    }
                })
            }
        })
    }

    const gotoLogin = () => {
        history.replace("/login")
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
                        <Box alignSelf="flex-start" marginBottom="10px">
                            <Typography variant="h5">
                                User Register
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
                        <Box style={{ padding: '5px 0px' }}>
                            <TextField
                                label="Password Again"
                                type="password"
                                variant="outlined"
                                onChange={e => setUserPass2(e.target.value)} />
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignSelf="stretch" marginTop="10px">
                            <Button color="primary" onClick={gotoLogin}>
                                Login
                        </Button>
                            <Button variant="contained" color="primary" onClick={onRegisterClick}>
                                Register
                        </Button>
                        </Box>

                    </Box>
                </div>
            </Card>
        </div>

    )
}
export default RegisterPage