import React from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {
    Grid, LinearProgress, Paper
} from "@material-ui/core";
import {PullRequest} from "../interfaces";
import PullRequestCard from "./PullRequestCard";
import Typography from "@material-ui/core/Typography";
import en from 'javascript-time-ago/locale/en'
import TimeAgo from "javascript-time-ago";
import CardContent from "@material-ui/core/CardContent";

TimeAgo.addDefaultLocale(en)


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(5)
        },
        cardContent: {
            textAlign: "left",
        },
        cardGrid: {
            paddingTop: theme.spacing(3),
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center'
        },
        title: {
            fontSize: 38,
        },
    }),
);

interface Props {
    list: PullRequestsByBase[]
}

interface PullRequestsByBase {
    base: string
    pullRequests: PullRequest[]
}

export default function PullRequestList({list}: Props) {
    const classes = useStyles();

    return (
        <>
            {
                list.length === 0 ?
                    <LinearProgress color="secondary"/>
                    :
                    <div className={classes.root}>
                        <Grid container spacing={3} justifyContent={"space-evenly"}>
                            {
                                list.map(({base, pullRequests}: PullRequestsByBase) => {
                                    return (
                                        <Grid item xs={4} key={base}>
                                            <Paper className={classes.paper}>
                                                <Typography variant="h2" gutterBottom className={classes.title}>
                                                    Pull requests to {base}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Pull requests {pullRequests.length}
                                                </Typography>
                                                <CardContent className={classes.cardContent}>
                                                    <Grid
                                                        container
                                                        direction="column"
                                                        className={classes.cardGrid}
                                                    >
                                                        {
                                                            pullRequests.map((pullRequest: PullRequest) => {
                                                                return (
                                                                    <Grid item key={pullRequest.id}>
                                                                        <PullRequestCard item={pullRequest}/>
                                                                    </Grid>
                                                                );
                                                            })
                                                        }
                                                    </Grid>
                                                </CardContent>
                                            </Paper>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </div>
            }
        </>
    );
}