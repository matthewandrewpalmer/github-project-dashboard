import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Repository, PullRequest} from "../interfaces";
import {
    Avatar, Chip,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    LinearProgress,
    Link,
    List,
    ListItem, ListItemAvatar,
    ListItemText, ListSubheader
} from "@material-ui/core";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {formatText} from "../functions/TextFormmating";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 350,
            minHeight: 245
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
        githubBadge: {
            padding: 5
        }
    }));


interface Props {
    item: Repository
}


export default function ProjectCard(props: Props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    let {item} = props;

    let [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState(false);

    let [prList, setPRList] = useState<PullRequest[]>([])

    const handleExpandClick = () => {
        setExpanded(!expanded);
        getPRs()
    };


    function getPRs() {
        fetch("/api/pulls/" + item.name)
            .then((data) => {
                data.json()
                    .then((list: PullRequest[]) => {
                        setPRList(list)
                    }).catch((error) => {
                    console.error(error)
                })
            }).catch((error) => {
            console.error("get failed")
        }).then(() => setLoading(false))
    }

    // console.log(item)
    return (
        <Card className={classes.root}>
            <CardContent>
                {item.archived && (
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Archived
                    </Typography>
                )}
                <Typography variant="h5" component="h2">
                    {formatText(item.name)}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {item.language}
                </Typography>
                <Typography variant="body2" component="p">
                    {item.description}
                </Typography>
                <br/>
                <Chip label={`Pull requests: ${item.open_issues_count}`}/>
                <br/>
                {/* Github Badges */}
                <div className={classes.githubBadge}>
                    <a href={`https://github.com/ONSdigital/${item.name}/graphs/contributors`}>
                        <img src={`https://img.shields.io/github/contributors/ONSdigital/${item.name}.svg`}
                             alt={"contributors badge"}/>
                    </a>
                </div>

                <div className={classes.githubBadge}>
                    <a href={`https://github.com/ONSdigital/${item.name}/commits`}>
                        <img src={`https://img.shields.io/github/last-commit/ONSdigital/${item.name}.svg`}
                             alt={"Last commit badge"}/>
                    </a>
                </div>

                <div className={classes.githubBadge}>
                    <a href={`https://codecov.io/gh/ONSdigital/${item.name}`}>
                        <img
                            src={`https://codecov.io/gh/ONSdigital/${item.name}/branch/main/graph/badge.svg?token=R0mEgR7R61`}
                            alt={"Code coverage badge"}/>
                    </a>
                </div>

                <div className={classes.githubBadge}>
                    <a href={`https://lgtm.com/projects/g/ONSdigital/${item.name}/context:${item.language}`}>
                        <img
                            alt={`Language grade: ${item.language}`}
                            src={`https://img.shields.io/lgtm/grade/${(item.language === "TypeScript" ? "javascript" : item.language.toLowerCase())}/g/ONSdigital/${item.name}.svg?logo=lgtm&logoWidth=18`}/>
                    </a>
                </div>

            </CardContent>
            <CardActions>
                <Button size="small" color="primary" href={item.html_url}>Open repo</Button>
                <Button size="small" href={item.pulls_url}>Pull request</Button>
                {
                    item.open_issues_count > 0 && (
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon/>
                        </IconButton>
                    )
                }

            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit style={{marginBottom: 45}}>
                <Divider/>
                {
                    loading && <LinearProgress color={"secondary"}/>
                }
                <List aria-label="main mailbox folders" subheader={<ListSubheader>Open pull requests</ListSubheader>}>
                    {
                        prList.map((item: PullRequest) => {
                            console.log(item)
                            return (
                                <Link href={item.html_url} underline={'none'} color={'inherit'} key={item.id}>
                                    <ListItem button>
                                        <ListItemAvatar>
                                            <Avatar alt={item.user.login} src={item.user.avatar_url}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.title}/>
                                    </ListItem>
                                </Link>
                            )
                        })
                    }
                </List>

            </Collapse>
        </Card>
    );
}