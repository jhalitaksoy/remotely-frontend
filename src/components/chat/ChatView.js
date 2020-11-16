import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageList from './MessageList';
import MessageSender from './MessageSender';
import { useState } from 'react';
import { getChat } from '../../controller/ChatController';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
}))

const testData = [{
    ID: 0,
    user: {
        ID: 0,
        name: 'hlt'
    },
    text: 'Hello'
},
{
    ID: 0,
    user: {
        ID: 0,
        name: 'Alice'
    },
    text: 'Hello hlt'
}
]

function ChatView(props) {

    const classes = useStyles();

    const [messages, setMessages] = useState([])

    const [chatLoadState, setChatLoadState] = useState("loading")

    if (chatLoadState != 'loaded') {
        getChat(props.roomID, (data, err) => {
            if (err) {
                setChatLoadState("error")
                return
            }
            setChatLoadState("loaded")
            if(data)setMessages(data)
            console.log("loaded");
        })
    }

    const onChatMessage = (message) => {
        if (chatLoadState == "loaded")
            setMessages([...messages, message])
    }

    const onSendMessage = (message) => {
        props.streamController.sendChatMessage(message)
    }

    if (props.streamController)
        props.streamController.onChatMessage = onChatMessage;

    return (
        <div className={classes.container}>
            <MessageList messages={messages} />
            <MessageSender onSendMessage={onSendMessage} />
        </div>
    )
}

export default ChatView;