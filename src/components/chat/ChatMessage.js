import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((thme) => ({
    chatMessage: {
        display: 'flex',
        margin: '5px',
    }
}))

const ChatMessage = (props) => {

    const classes = useStyles()

    return (<div className={classes.chatMessage}>
        <Typography
            variant="body2"
            style={{ fontWeight: 'bold', marginRight: '5px' }}
        >{props.message.user.name}</Typography>
        <Typography variant="body2" >{props.message.text}</Typography>
    </div>);
}

export default ChatMessage;