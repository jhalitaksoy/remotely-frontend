import { Box, Button, Card, CardHeader, Grid, Paper, Toolbar, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyAppBar from '../components/MyAppBar';
import { getRoom } from '../controller/RoomControlker';
import { StreamController } from '../controller/StreamController';
import { makeStyles } from '@material-ui/core/styles'
import ChatView from '../components/chat/ChatView';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    chat: {
        flexGrow: 1,
        width: '100%',
        padding: '10px',
        background: 'rgb(240, 240, 240)',
    },
    video: {
        width: '100%',
        height: '100%',
        //border : "1px solid grey", 
        //borderRadius: "10px" 
    },
    toolbar: {
        justifyContent : 'center',
        background: 'white',
        boxShadow : '0px 0px 5px 0px rgba(0,0,0,0.75)',
        //border : "1px solid grey", 
        //borderRadius: "10px" 
    }
}));

function RoomPage(params) {
    const { id } = useParams()
    const classes = useStyles()

    const [room, setRoom] = useState(undefined)
    const [connectionState, setConnectionState] = useState("empty")
    const [streamController, setStreamController] = useState(undefined)
    const [roomLoadState, setRoomLoadState] = useState("loading")

    useEffect(() => {
        if (roomLoadState != "loaded") {
            getRoom(id, (res, err) => {
                if (err) {
                    setRoomLoadState("error")
                }
                setRoomLoadState("loaded")
                setRoom(res)
                setStreamController(new StreamController())
            })
        }
    })

    const onStatusChange = (text) => {
        setConnectionState(text)
    }

    if (!room) {
        return <div>Not Found</div>
    }

    return (
        <Box display="flex" height="100%" flexDirection="column">
            <MyAppBar title={room && room.Name} />
            <Box display="flex" flexGrow="1">
                <Box flex="3">
                    <video className={classes.video} id="id_video" autoPlay muted />
                </Box>
                <Box flex="1" className={classes.chat}>
                    <ChatView> 

                    </ChatView>
                </Box>
            </Box>
            <Toolbar className={classes.toolbar}>
                <Button variant="contained" color="primary">
                    Share Screen
                </Button>
                <Box width="10px"/>
                <Button variant="contained" color="primary">
                    Open Microphone
                </Button>
            </Toolbar>
            {/* <Grid justify="center" container>
                <Grid item>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="secondary"
                                onClick={(e) => {
                                    streamController.start(room.ID, onStatusChange)
                                    streamController.publish()
                                }} >Publish</Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="secondary"
                                onClick={(e) => {
                                    streamController.start(room.ID, onStatusChange)
                                    streamController.join()
                                }} >Join</Button>
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="secondary"
                                onClick={(e) => {
                                    streamController.cancel(room.ID)
                                }} >Cancel</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} justify="center" alignItems="center">
                    <Box display="flex" alignItems="center" justifyContent="center"
                        margin="10px">
                        <Typography variant="subtitle2">{connectionState}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center" direction="column" alignItems="center">
                        <Grid item >
                            <video style={{ border: "1px solid grey", borderRadius: "10px" }} id="id_video"
                                width="683px" height="369px"
                                autoPlay muted>

                            </video>
                        </Grid>
                    </Grid>
                </Grid>

                <div id="stats-box">

                </div>
            </Grid> */}
        </Box>
    )
}

export default RoomPage