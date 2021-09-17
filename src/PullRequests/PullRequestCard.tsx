import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {PullRequest} from "../interfaces";
import {Avatar, CardHeader, Chip,} from "@material-ui/core";
import TimeAgo from 'javascript-time-ago';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: 150,
            marginBottom: 10
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        chipBox: {
            marginBottom: 5,
        },
        chip: {
            marginRight: theme.spacing(0.5),
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }));


interface Props {
    item: PullRequest
}


export default function PullRequestCard({item}: Props) {
    const classes = useStyles();

    const timeAgo = new TimeAgo('en-US')


    return (
        <Card className={classes.root} variant="outlined">
            <CardHeader
                avatar={
                    <Avatar alt={item.user.login} src={item.user.avatar_url}/>
                }
                title={item.title}
                subheader={item.repository}
            />
            <CardContent>
                <div className={classes.chipBox}>
                    {
                        (item.user.login === "dependabot[bot]") && <Chip color="primary" size="small" label="dependabot" className={classes.chip}/>
                    }
                    {
                        ((item.user.login === "social-surveys-blaise-concourse") && <Chip color="secondary" size="small" label="Concourse promotion" className={classes.chip}/>)
                    }
                    {
                        ((item.draft) && <Chip size="small" label="Draft" className={classes.chip}/>)
                    }

                </div>

                <Typography variant="body2" component="p">
                    <b>From:</b> {item.head.ref}
                    <br/>
                    <b>To:</b> {item.base.ref}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Last updated {timeAgo.format(new Date(item.updated_at))}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small"
                        color="primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={item.html_url}>Open pull request</Button>
                {/*<Button size="small" href={item.url}>Pull request</Button>*/}
            </CardActions>
        </Card>
    );
}