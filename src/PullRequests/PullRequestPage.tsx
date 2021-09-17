import React, {useEffect, useState} from 'react';
import PullRequestList from "./PullRequestList";
import _ from "lodash";
import {pullRequestList as mockPullRequetList} from "./PullRequestMockList";
import ErrorSnackbar from "../ErrorSnackbar";
import {
    CircularProgress,
    Divider,
    Grid, LinearProgress,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Switch
} from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {PullRequest} from "../interfaces";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            minHeight: '100vh',
            height: '100%',
            maxWidth: 250,
            backgroundColor: theme.palette.background.paper,
        },
        filtersCircle: {
            paddingTop: theme.spacing(10),
            paddingBottom: theme.spacing(10),
            textAlign: "center"
        },
    }),
);

function groupPullRequestsByBaseBranch(list: PullRequest[]) {
    let pullRequestsByBranch: any[] = _.chain(list)
        .groupBy("base.ref")
        .map((value: any[], key: string) => ({base: key, pullRequests: value}))
        .value();

    return _.sortBy(pullRequestsByBranch, (e) => {
        return e.base
    });
}

function removeUserFromPullRequestsList(user: string, pullRequestList: any[]) {
    _.remove(pullRequestList, function (item: PullRequest) {
        return item.user.login === user
    });
}

const PullRequestPage = () => {
    const classes = useStyles();

    let [unfilteredPullRequestList, setUnfilteredPullRequestList] = useState<any[]>([]);
    let [pullRequestList, setPullRequestList] = useState<any[]>([]);
    let [listError, setListError] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);
    let [showDependabot, setShowDependabot] = useState<boolean>(true);
    let [showConcourse, setShowConcourse] = useState<boolean>(true);

    function getPullRequests() {
        setLoading(true);
        fetch("/api/pulls")
            .then((data) => {
                data.json()
                    .then((list) => {
                        console.log(list)
                        setUnfilteredPullRequestList(list)

                    }).catch((error) => {
                    console.error(error, "get failed")
                    setListError(true)
                })
            }).catch((error) => {
            console.error(error, "get failed")
            setListError(true)
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        getPullRequests()
        // setPullRequestList(mockPullRequetList)
    }, []);

    useEffect(() => {
        const pullRequestList = [...unfilteredPullRequestList];
        if (!showDependabot) {
            removeUserFromPullRequestsList("dependabot[bot]", pullRequestList);
        }
        if (!showConcourse) {
            removeUserFromPullRequestsList("social-surveys-blaise-concourse", pullRequestList);
        }

        let pullRequestsByBranch = groupPullRequestsByBaseBranch(pullRequestList);
        setPullRequestList(pullRequestsByBranch);
    }, [unfilteredPullRequestList, showDependabot, showConcourse]);


    return (
        <>
            {loading && <LinearProgress color="secondary"/>}
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <div className={classes.list}>
                        <List subheader={<ListSubheader>Filter pull requests</ListSubheader>}>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={"Include dependabot"}/>
                                <ListItemSecondaryAction>
                                    <Switch
                                        checked={showDependabot}
                                        onChange={() => setShowDependabot(!showDependabot)}
                                        name="checkedB"
                                        color="primary"
                                        edge="end"
                                        inputProps={{'aria-labelledby': 'switch-list-label-wifi'}}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <ListItemText id="switch-list-label-wifi" primary={"Include Concourse"}/>
                                <ListItemSecondaryAction>
                                    <Switch
                                        checked={showConcourse}
                                        onChange={() => setShowConcourse(!showConcourse)}
                                        name="checkedB"
                                        color="primary"
                                        edge="end"
                                        inputProps={{'aria-labelledby': 'switch-list-label-wifi'}}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                        <Divider/>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div>
                        <PullRequestList list={pullRequestList}/>

                        {/*<Grid container spacing={3}>*/}
                        {/*    {*/}
                        {/*        props.list.length === 0 ?*/}
                        {/*            // <CircularProgress className={classes.circle}/>*/}
                        {/*            <CircularProgress className={classes.circle}/>*/}
                        {/*            :*/}
                        {/*            props.list.map((item: Repository) => {*/}
                        {/*                return (*/}
                        {/*                    <Fragment key={item.id}>*/}
                        {/*                        <Grid item xs={4}>*/}
                        {/*                            <ProjectCard item={item}/>*/}
                        {/*                        </Grid>*/}
                        {/*                    </Fragment>*/}

                        {/*                )*/}
                        {/*            })*/}
                        {/*    }*/}

                        {/*</Grid>*/}
                    </div>
                </Grid>
            </Grid>


            {
                listError && <ErrorSnackbar/>
            }
        </>
    );
};

export default PullRequestPage;