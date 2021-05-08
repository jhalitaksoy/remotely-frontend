import React, { useState } from 'react';
import { Box, Grid, Paper, Snackbar } from '@material-ui/core';
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
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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

    const [createRoomDialogOpen, setCreateRoomDialogOpen] = React.useState(false);
    const [snackBarOpen, setSnackBarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState();

    const updateRoomList = () => {
        setRoomListKey(roomListKey + 1)
    }

    const onCreateRoomClick = () => {
        setCreateRoomDialogOpen(true)
    }

    const onRoomCreate = (roomName) => {
        setCreateRoomDialogOpen(false)
        createRoom({ Name: roomName }, (res, err) => {
            if (err) {
                setSnackbarMessage(err.toString())
                setSnackBarOpen(true)
                return
            }
            updateRoomList()
        })
    }

    const handleCreateFromClose = () => {
        setCreateRoomDialogOpen(false)
    }

    const handleSnackBarClick = () => {
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };

    return (
        <>
            <MyAppBar title="Remotely" />
            <CreateRoomDialog open={createRoomDialogOpen} handleClose={handleCreateFromClose} onCreate={onRoomCreate} />
            <Grid justify="center" container>
                <Grid item xs={12} sm={4}>
                    <Paper style={{ margin: '10px' }}>
                        <RoomList key={roomListKey} />
                        <Box display="flex" justifyContent="center"
                            paddingBottom="10px"
                            paddingRight="10px">
                            <Fab
                                onClick={onCreateRoomClick}
                                size='small' color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleSnackBarClose}
                message={snackbarMessage}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackBarClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </>
    )
}
export default HomePage

function CreateRoomDialog(props) {

    const [roomName, setRoomName] = useState();
    const [roomNameSuitable, setRoomNameSuitable] = useState(false);

    const onChange = (e) => {
        setRoomName(e.target.value)
        checkNameIsSuitable(e.target.value)
    }

    const checkNameIsSuitable = (name)=>{
        if(name){
            if(name.length > 0){
                setRoomNameSuitable(true)
                return
            }
        }
        setRoomNameSuitable(false)
    }

    return (
        <Dialog open={props.open}>
            <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
            <DialogContent>
                <TextField
                    onChange={onChange}
                    variant="outlined"
                    autoFocus
                    id="name"
                    label="Room Name"
                    fullWidth
                />
            </DialogContent>
            <DialogActions >
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
               <Button disabled={!roomNameSuitable} onClick={()=>{
                   props.onCreate(roomName)
               }} color="primary" variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}