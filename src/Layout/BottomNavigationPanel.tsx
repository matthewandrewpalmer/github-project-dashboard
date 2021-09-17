import React from 'react';
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ListIcon from "@material-ui/icons/List";
import ListAltIcon from "@material-ui/icons/ListAlt";
import {useHistory} from "react-router-dom";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import WhatshotIcon from '@material-ui/icons/Whatshot';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bottomNavigation: {
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100%",
            boxShadow: "0px 0px 5px 1px #858585"
        }
    }),
);

const BottomNavigationPanel = () => {
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState(history.location.pathname);

    return (
        <>
            <nav>
                <BottomNavigation
                    className={classes.bottomNavigation}
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        history.push(newValue);
                    }}
                    showLabels
                >
                    <BottomNavigationAction value={"/"} label="Home" icon={<HomeIcon/>}/>
                    <BottomNavigationAction value={"/blaise"} label="Blaise Status" icon={<WhatshotIcon/>}/>
                    <BottomNavigationAction value={"/pullrequests"} label="Pull Requests" icon={<ListIcon/>}/>
                    <BottomNavigationAction value={"/repositories"} label="Repositories" icon={<ListAltIcon/>}/>
                </BottomNavigation>
            </nav>
        </>
    );
};

export default BottomNavigationPanel;