import React from 'react';
import { Redirect } from "react-router-dom";
import { useState, useEffect } from 'react';
//import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton';
import { currentUser } from '../controller/UserController';
import { useHistory } from "react-router-dom";
import { Box, List, ListItem, ListItemText, Grid, Paper, ListSubheader } from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ShareIcon from '@material-ui/icons/Share';
import { createRoom, listRooms } from '../controller/RoomControlker';
import MyAppBar from '../components/MyAppBar';

//const useStyles = makeStyles((theme) => ({
//    root: {
//        flexGrow: 1,
//    },
//    menuButton: {
//        marginRight: theme.spacing(2),
//    },
//    title: {
//        flexGrow: 1,
//    },
//}));

function HomePage(props) {
    //const classes = useStyles()
    const history = useHistory()
    const [rooms, setRooms] = useState(undefined)
    const [roomsLoadState, setRoomsLoadState] = useState("loading")

    useEffect(() => {
        if(roomsLoadState === 'loaded' ) return
        listRooms((res, err) => {
            if (err) {
                setRoomsLoadState('error')
                return
            }
            setRoomsLoadState('loaded')
            setRooms(res)
        })
    });

    if (!currentUser()) {
        return <Redirect to="/login" />
    }

    //const logoutClick = () => {
    //    logoutUser()
    //    history.replace("/login")
    //}

    const onCreateRoom = () => {
        setRoomsLoadState("loading")
        const name = window.prompt("Room Name", "Room1")
        createRoom({ Name: name }, (res, err) => {
            if (err) {
                return
            }
            setRoomsLoadState("loading")
        })
    }

    const onRoomSelected = (room) => {
        history.push(`/room/${room.ID}`)
    }

    let roomsUI = undefined
    if (roomsLoadState === 'loaded' && rooms) {
        var i = -1;
        roomsUI = rooms.map((room) => {
            i++;
            return <ListItem key={i} onClick={(e) => onRoomSelected(room)} button>
                <ListItemAvatar>
                    <Avatar>
                        <ImageIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText>
                    {room.Name}
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                        <ShareIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        })
    } else  if (roomsLoadState === 'loading'){
        roomsUI = <div style={{textAlign:"center", margin : "15px"}}>Loading...</div>
    }
    else  if (roomsLoadState === 'error'){
        roomsUI = <div style={{textAlign:"center", margin : "15px"}}>Error</div>
    }

    return (
        <div>
            <MyAppBar title="Remotely"/>
            <Box height="30px">
            </Box>
            <Grid justify="center" container>
                <Grid item xs={4}>
                    <Paper>
                        <List
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Your Rooms
                            </ListSubheader>
                            }
                        >
                            {roomsUI}
                        </List>
                        <Box display="flex" justifyContent="center"
                            paddingBottom="10px"
                            paddingRight="10px">
                            <Fab
                                onClick={onCreateRoom}
                                size='small' color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div >
    )
}
export default HomePage