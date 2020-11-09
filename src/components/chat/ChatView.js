import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageList from './MessageList';
import MessageSender from './MessageSender';
import { useState } from 'react';

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

    const [messages, setMessages] = useState(testData)

    const onSendMessage = (message) => {
        setMessages([...messages, message])
    }

    return (
        <div className={classes.container}>
            <MessageList messages={messages} />
            <MessageSender onSendMessage={onSendMessage} />
        </div>
    )
}

export default ChatView;