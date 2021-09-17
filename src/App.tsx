import React from 'react';
import {createStyles, makeStyles, Theme,} from "@material-ui/core/styles";
import AppBarHeader from "./Layout/AppBarHeader";
import PullRequestPage from "./PullRequests/PullRequestPage";
import {Route, Switch as RouterSwitch} from "react-router-dom";
import RepositoryPage from "./Repositories/RepositoryPage";
import BottomNavigationPanel from "./Layout/BottomNavigationPanel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            minHeight: '100vh',
            height: '100%',
            maxWidth: 250,
            backgroundColor: theme.palette.background.paper,
        },
        contentBackground: {
            backgroundColor: "#f5f5f5",
            backgroundSize: 'cover',
            paddingTop: '64px',
            paddingBottom: '64px',
            minHeight: "100vh"
        },
    }),
);

function App() {
    const classes = useStyles();

    return (
        <>
            <AppBarHeader reloadList={() => console.log("button")}/>
            <div className={classes.contentBackground}>
                <RouterSwitch>
                    <Route path="/repositories">
                        <RepositoryPage/>
                    </Route>
                    <Route path="/pullrequests">
                        <PullRequestPage/>
                    </Route>
                    <Route path="/">
                        <h1>Home</h1>
                    </Route>
                </RouterSwitch>
            </div>
            <BottomNavigationPanel/>
        </>
    );
}

export default App;
