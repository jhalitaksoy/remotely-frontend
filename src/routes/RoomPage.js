import { Box, Button, Grid, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyAppBar from '../components/MyAppBar';
import { getRoom } from '../controller/RoomControlker';
import { StreamController } from '../controller/StreamController';

function RoomPage(params) {
    const { id } = useParams()

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
        <div>
            <MyAppBar title={room && room.Name} />
            <Box marginTop="10px" />
            <Grid justify="center" container>
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
            </Grid>
        </div>
    )
}

export default RoomPage