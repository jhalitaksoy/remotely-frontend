import React from 'react';
import ChatMessage from './ChatMessage';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => (
    {
        messageList : {
            display : 'flex',
            width : "100%",
            flexDirection : 'column',
            flexGrow : '1',
            //alignItems : 'center',
        }
    }
))

const MessageList = (props) => {

    const classes = useStyles()

    const messageViews = props.messages.map((message)=><ChatMessage message={message}/>)
    return ( <div className={classes.messageList}>
        {messageViews}
    </div> );
}
 
export default MessageList;