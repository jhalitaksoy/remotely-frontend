import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import { currentUser } from '../../controller/UserController';

const useStyles = makeStyles((thme) => ({
    messageSender: {
        display: 'flex',
        padding : '10px',
        background : 'white',
    }
}))

const MessageSender = (props) => {
    const classes = useStyles()
    const [message, setMessage] = useState('')
    const onMessageChange = (event) => {
        setMessage(event.target.value)
    }
    const onSendMessage = () => {
        const user = currentUser()
        const newMessage = {
            user: {
                ID: parseInt(user.id),
                name: '',
            },
            text: message,
        }
        props.onSendMessage(newMessage)
    }
    return (<div className={classes.messageSender}>
        <TextField variant="outlined" onChange={onMessageChange}></TextField>
        <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            color="primary"
            onClick={onSendMessage}
        >Send</Button>
    </div>);
}

export default MessageSender;