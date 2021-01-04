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
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: 'center',
    },
    appbar : {
        borderBottom : '1px solid #dcd3d3',
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
        <AppBar className={classes.appbar} position="static" elevation={0} color="white">
            <Toolbar variant="dense">
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {props.title}
            </Typography>
                <Button color="inherit" onClick={logoutClick}><AccountCircleOutlined/></Button>
            </Toolbar>
        </AppBar>
    )
}

export default MyAppBar