import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageList from './MessageList';
import MessageSender from './MessageSender';
import { useState, useRef, useEffect } from 'react';
import { getChat, sendChatMessage, setOnMessageCallback, createSurvey , setSurveyCreateMessageCallback} from '../../controller/ChatController';
import { Button, Chip, Dialog, DialogTitle, TextField, Typography } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVertOutlined';
import SurveyList from '../SurveyList';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
    },

    chatTitle: {
        padding: '10px',
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
}))

/*const testData = [{
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

const testSurvey = {
    text : "Title",
    options : [
        {
            id : 0,
            text : "Option1",
            count : 0,
        },
        {
            id : 1,
            text : "Option2",
            count : 0,
        }
    ],
    owner : {
        id : 0,
        name : "hlt"
    }
}*/

function ChatView(props) {

    const classes = useStyles();

    const [messages, setMessages] = useState([])

    const [chatLoadState, setChatLoadState] = useState("init")
    const messagesStateRef = useRef(messages);
    useEffect(
        () => {
            messagesStateRef.current = messages;
        },
        [messages],
    );

    const [surveyDialogOpen, setSurveyDialogOpen] = React.useState(false)

    const [surveys, setSurveys] = React.useState([])
    
    setSurveyCreateMessageCallback((survey) => {
        setSurveys([...surveys, survey])
    })

    if (chatLoadState === 'init') {
        setChatLoadState("loading")
        getChat(props.roomID, (data, err) => {
            if (err) {
                setChatLoadState("error")
                return
            }
            setChatLoadState("loaded")
            setOnMessageCallback(onChatMessage)
            if (data) setMessages(data)
        })
    }

    const addNewMessage = (message) => {
        const oldMessages = messagesStateRef.current
        setMessages([...oldMessages, message])
    }

    const onChatMessage = (message) => {
        addNewMessage(message)
    }

    const onSendMessage = (message) => {
        sendChatMessage(message)
    }

    const handleChatOpen = () => {
        setSurveyDialogOpen(true)
    }

    const handleClose = (value) => {
        setSurveyDialogOpen(false);
    };

    return (
        <div className={classes.container}>
            <div className={classes.chatTitle}>
                <Typography variant="h5">Chat</Typography>
                <Button style={{ marginLeft: "auto" }} onClick={handleChatOpen}><MoreIcon /></Button>
            </div>
            <SurveyList surveys={surveys}/>
            <MessageList messages={messages} />
            <MessageSender onSendMessage={onSendMessage} />
            <SurveyDialog open={surveyDialogOpen} onClose={handleClose} ></SurveyDialog>
        </div>
    )
}

export default ChatView;

function SurveyDialog(props) {

    const [surveyText, setSurveyText] = useState("")

    const [options, setOptions] = useState([])

    const [optionText, setOptionText] = useState("")

    const [canAddOption, setCanAddOption] = useState(false)

    const onOptionAdd = () => {
        options.push(optionText)
        setOptionText("")
        setOptions(options)
    }

    const onSurveyTextChange = (e) => {
        setSurveyText(e.target.value)
    }

    const onOptionTextChange = (e) => {
        setOptionText(e.target.value)

        if (e.target.value === '') {
            setCanAddOption(false)
            return
        }

        for (const option of options) {
            if (option === e.target.value) {
                setCanAddOption(false)
                return
            }
        }
        setCanAddOption(true)
    }

    const onOptionDelete = (option) => {
        for (var i = 0; i < options.length; i++) {
            if (options[i] === option) {
                options.splice(i, 1)
                break;
            }
        }
        setOptions(options)
    }

    const onSurveyCreate = () => {
        props.onClose()
        createSurvey({
            "text": surveyText,
            "options": getOptions(),
        })
    }

    const getOptions = () =>{
        let count = -1
        return options.map((option)=>{
            count++
            return {
                "id" : count,
                "text" : option,
                "count" : 0,
            }
        })
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} >
            <DialogTitle>Create Survey</DialogTitle>
            <div style={{
                padding: "0px 20px 20px 25px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
            }}>
                <Typography style={{ marginBottom: '10px' }} variant='subtitle2'>Survey Text</Typography>
                <TextField
                    //value={message}
                    //onChange={onMessageChange}
                    size="small" variant="outlined"
                    value={surveyText} onChange={onSurveyTextChange}
                ></TextField>

                <Typography style={{ marginTop: '10px' }} variant='subtitle2'>Options</Typography>

                {
                    options.length == 0 ? <div style={{
                        padding: "20px 20px 10px 5px",
                        alignSelf: 'stretch',
                    }}> There is no option! </div> :
                        options.map((option) => {
                            return <Chip
                                style={{ marginTop: '5px' }} onDelete={() => onOptionDelete(option)} label={option}>
                                Hello</Chip>;
                        })
                }

                <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <TextField variant="outlined" size="small"
                        value={optionText} onChange={onOptionTextChange}>

                    </TextField>
                    <Button disabled={!canAddOption} onClick={onOptionAdd}>Add</Button>
                </div>

                <Button
                    disabled={options.length < 2 || surveyText === ''}
                    variant="contained" color="primary"
                    onClick={onSurveyCreate}
                    style={{ alignSelf: 'stretch', marginTop: '20px' }}>Create</Button>

            </div>
        </Dialog>
    )
}