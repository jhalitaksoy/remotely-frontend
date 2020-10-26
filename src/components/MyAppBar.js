import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { logoutUser } from '../controller/UserController';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function MyAppBar(props) {
    const classes = useStyles()
    const history = useHistory()
    const logoutClick = () => {
        logoutUser()
        history.replace("/login")
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.title}
            </Typography>
                <Button color="inherit" onClick={logoutClick}>Logout</Button>
            </Toolbar>
        </AppBar>
    )
}

export default MyAppBar