import { Box, Button, Toolbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyAppBar from '../components/MyAppBar';
import { getRoom } from '../controller/RoomControlker';
import { StreamController } from '../controller/StreamController';
import { makeStyles } from '@material-ui/core/styles'
import ChatView from '../components/chat/ChatView';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareSharpIcon from '@material-ui/icons/ScreenShareSharp';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    roomContainer: {
        display: "flex",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    chat: {
        flexGrow: 1,
        width: '100%',
        background: 'rgb(240, 240, 240)',
    },
    video: {
        width: '100%',
        height: '100%',
        maxHeight: 'calc(100vh - 132px)'
        //border : "1px solid grey", 
        //borderRadius: "10px" 
    },
    toolbar: {
        justifyContent: 'center',
        background: 'white',
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
        //border : "1px solid grey", 
        //borderRadius: "10px" 
    }
}));

function RoomPage(params) {
    const { id } = useParams()
    const classes = useStyles()

    const [room, setRoom] = useState(undefined)
    //const [connectionState, setConnectionState] = useState("empty")
    const [streamController, setStreamController] = useState(undefined)
    const [roomLoadState, setRoomLoadState] = useState("loading")
    const [micState, setMicState] = useState(true)

    useEffect(() => {
        if (roomLoadState !== "loaded") {
            getRoom(id, (res, err) => {
                if (err) {
                    setRoomLoadState("error")
                    return
                }
                setRoomLoadState("loaded")
                setRoom(res)
                const streamController = new StreamController()
                setStreamController(streamController)
                streamController.start(res.ID, onStatusChange)
                streamController.join()
            })
        }
    })

    const onStatusChange = (text) => {
        //setConnectionState(text)
    }

    const onShareScreenClick = (e) => {
        streamController.cancel()
        streamController.start(room.ID, onStatusChange)
        streamController.publish()
    }

    const onOpenAudioClick = (e) => {
        setMicState(!micState)
        if (micState)
            streamController.pauseAudioSend();
        else
            streamController.resumeAudioSend();
    }

    let content;

    if (roomLoadState == "loading") {
        content =
            <Box display="flex" height="100%" flexDirection="column">
                <div>Loading</div>
            </Box>
    } else if (roomLoadState == "error") {
        content =
            <Box display="flex" height="100%" flexDirection="column">
                <div>Not Found</div>
            </Box>
    } else if (!room) {
        content =
            <Box display="flex" height="100%" flexDirection="column">
                <div>Not Found</div>
            </Box>
    } else {
        let roomID = undefined
        if (room) roomID = room.ID
        content =
            <Box display="flex" height="100%" flexDirection="column">
                <MyAppBar title={room && room.Name} />
                <Box display="flex" flexGrow="1">
                    <Box flex="3" display="flex" alignItems="center">
                        <video className={classes.video} id="id_video" autoPlay muted />
                    </Box>
                    <Box flex="1" className={classes.chat}>
                        <ChatView roomID={roomID} />
                    </Box>
                </Box>
                <Toolbar className={classes.toolbar}>
                    <audio id="audioBox" autoPlay controls></audio>
                    <Button variant="contained" color="primary"
                        onClick={onShareScreenClick}>
                        <ScreenShareSharpIcon/>
                        Screen Share
                    </Button>
                    <Box width="10px" />
                    <Button variant="contained" color="primary" onClick={onOpenAudioClick}>
                        {micState ? <MicIcon/> : <MicOffIcon/>}
                    </Button>
                </Toolbar>
            </Box>
    }

    return (content)
}

export default RoomPage