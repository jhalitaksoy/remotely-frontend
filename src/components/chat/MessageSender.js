import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((thme) => ({
    messageSender: {
        display: 'flex',
        padding: '10px',
        background: 'white',
        alignSelf:"stretch"
    }
}))

const MessageSender = (props) => {
    const classes = useStyles()
    const [message, setMessage] = useState('')
    const onMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const onSendMessage = () => {
        const newMessage = {
            text: message,
        }
        props.onSendMessage(newMessage)

        setMessage("")
    }
    return (<div className={classes.messageSender}>
        <TextField
        style={{flexGrow:"1"}}
            placeholder="Type Message"
            value={message}
            onChange={onMessageChange}
            size="small" variant="outlined"></TextField>
        <Button
            style={{ marginLeft: '10px' }}
            variant="outlined"
            color="secondary"
            onClick={onSendMessage}
        ><SendIcon/></Button>
    </div>);
}

export default MessageSender;