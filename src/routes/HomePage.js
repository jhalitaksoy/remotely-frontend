import React, { useState } from 'react';
import { Box, Grid, Paper } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { createRoom } from '../controller/RoomController';
import MyAppBar from '../components/MyAppBar';
import RoomList from '../components/RoomList';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

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
    //const history = useHistory()

    const [roomListKey, setRoomListKey] = useState(0)

    //const [createRoomDialogOpen, setCreateRoomDialogOpen] = React.useState(false);

    const updateRoomList = () => {
        setRoomListKey(roomListKey + 1)
    }

    //if (!currentUser()) {
    //    return <Redirect to="/login" />
    //}

    //const logoutClick = () => {
    //    logoutUser()
    //    history.replace("/login")
    //}

    const onCreateRoom = () => {
        const name = window.prompt("Room Name", "Room1")
        createRoom({ Name: name }, (res, err) => {
            if (err) {
                return
            }
            updateRoomList()
        })
    }

    return (
        <>
            <MyAppBar title="Remotely" />
            <CreateRoomDialog />
            <Grid justify="center" container>
                <Grid item xs={12} sm={4}>
                    <Paper style={{ margin: '10px' }}>
                        <RoomList key={roomListKey} />
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
        </>
    )
}
export default HomePage

function CreateRoomDialog(props) {
    const [open, setOpen] = React.useState(props.open);

    /*const handleClickOpen = () => {
        setOpen(true);
    };*/

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open}>
            <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Create a room.
                </DialogContentText>
                <TextField
                    variant="outlined"
                    autoFocus
                    id="name"
                    label="Room Name"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}