import { Box, Button, CircularProgress, Toolbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyAppBar from '../components/MyAppBar';
import { getRoom } from '../controller/RoomController';
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
        maxHeight: 'calc(100vh - 132px)',
        backgroundColor: 'white !important',
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
    const [roomLoadError, setRoomLoadError] = useState();
    const [micState, setMicState] = useState(false)

    const updateMicState = () => {
        if (micState)
            streamController.pauseAudioSend();
        else
            streamController.resumeAudioSend();
    }


    useEffect(() => {
        getRoom(id, (res, err) => {
            if (err) {
                setRoomLoadError(err)
                setRoomLoadState("error")
                return
            }
            setRoomLoadState("loaded")
            setRoom(res)
            const streamController = new StreamController()
            setStreamController(streamController)
            streamController.start(res.ID, onStatusChange)
            streamController.join(micState)
            //updateMicState()
        })

        return () => {
            if (streamController) {
                streamController.cancel()
            }
        }
    }, [])

    // Select elements here
    const video = document.getElementById('id_video');
    if (video) {
        const videoControls = document.getElementById('video-controls');

        const videoWorks = !!document.createElement('video').canPlayType;
        if (videoWorks) {
            video.controls = false;
            if (videoControls) {
                videoControls.classList.remove('hidden');
            }
        }
    }

    const onStatusChange = (text) => {
        //setConnectionState(text)
    }

    const onShareScreenClick = (e) => {
        streamController.cancel()
        streamController.start(room.ID, onStatusChange)
        streamController.publish(micState)
        //updateMicState()
    }

    const onOpenAudioClick = (e) => {
        setMicState(!micState)
        updateMicState()
    }


    let content;

    if (roomLoadState === "loading") {
        content = (
            <Container>
                <CircularProgress />
            </Container>
        )
    } else if (roomLoadState === "error") {
        content = (
            <Container>
                <div>{roomLoadError.toString()}</div>
            </Container>
        )
    } else if (!room) {
        content = (
            <Container>
                <div>Internal Error</div>
            </Container>
        )
    } else {
        let roomID = undefined
        if (room) roomID = room.ID
        content =
            <Box display="flex" height="100%" flexDirection="column">
                <MyAppBar title={room && room.Name} />
                <Box display="flex" flexGrow="1">
                    <Box flex="3" display="flex" alignItems="center">
                        <video preload="none" poster="none" controls={false} className={classes.video} id="id_video" autoPlay muted />
                    </Box>
                    <Box flex="1" className={classes.chat}>
                        <ChatView roomID={roomID} />
                    </Box>
                </Box>
                <Toolbar className={classes.toolbar}>
                    <audio id="audioBox" autoPlay controls></audio>
                    <Button variant="contained" color="primary"
                        onClick={onShareScreenClick}>
                        <ScreenShareSharpIcon />
                        Screen Share
                    </Button>
                    <Box width="10px" />
                    <Button variant="contained" color="primary" onClick={onOpenAudioClick}>
                        {micState ? <MicIcon /> : <MicOffIcon />}
                    </Button>
                </Toolbar>
            </Box>
    }

    return (content)
}

function Container({ children }) {
    return (
        <Box display="flex" height="100%" flexDirection="column" alignItems="center" justifyContent="center">
            {children}
        </Box>)
}

export default RoomPage