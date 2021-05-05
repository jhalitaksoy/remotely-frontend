import React, {useState, useEffect }from 'react';
import {
    List, ListSubheader, ListItemText,
    ListItemAvatar, ListItemSecondaryAction,
    Avatar, IconButton, ListItem, Box, Typography,
    Grid,CircularProgress,
} from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import ImageIcon from '@material-ui/icons/Image';
import { listRooms } from '../controller/RoomController';
import { useHistory } from 'react-router-dom';

function RoomList(props) {
    const history = useHistory()
    
    const [rooms, setRooms] = useState(undefined)
    const [roomsLoadState, setRoomsLoadState] = useState("loading")

    const loadRooms = () => {
        listRooms((res, err) => {
            if (err) {
                setRoomsLoadState('error')
                return
            }
            setRoomsLoadState('loaded')
            setRooms(res)
        })
    }

    const onRoomSelected = (room) => {
        history.push(`/room/${room.ID}`)
    }

    useEffect(() => {
        loadRooms()
    }, []);


    let child = undefined

    if (roomsLoadState === 'loading') {
        child = (
            <Grid container justify='center'>
                <Box margin='20px'>
                    <CircularProgress />
                </Box>
            </Grid>
        )
    } else if (roomsLoadState === 'error') {
        child = (
            <Box margin='20px'>
                <Typography variant='body1' align={'center'}>
                    Error
                </Typography>
            </Box>
        )
    } else if (!rooms || rooms.lenght === 0) {
        child = (
            <Box textAlign="center" paddingBottom="10px">
                Empty
            </Box>
        )
    } else {
        child = (
            rooms.map((room, id) => {
                return <RoomListItem id={id} room={room} onRoomSelected={onRoomSelected} />
            })
        )
    }

    return (
        <List subheader={
            <ListSubheader component="div" id="nested-list-subheader">
                Your Rooms
            </ListSubheader>}>
            {child}
        </List>
    )
}

function RoomListItem(props) {

    const { id, room, onRoomSelected } = props

    const onListItemClick = () => {
        if (onRoomSelected) {
            onRoomSelected(room)
        }
    }

    return (
        <ListItem key={id} onClick={onListItemClick} button>
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
    )
}

export default RoomList