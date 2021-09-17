import React, {useEffect, useState} from 'react';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import {
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
} from "@material-ui/core";
import {PullRequest, Repository} from "../interfaces";
import RepositoryAccordionList from "./RepositoryAccordionList";
import _ from "lodash";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // flexGrow: 1,
            padding: theme.spacing(2)
        },
        gridList: {
            width: 500,
            height: 450,
        },
        languageCircle: {
            paddingTop: theme.spacing(10),
            paddingBottom: theme.spacing(10),
            textAlign: "center"
        },
        circle: {
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center"
        }, list: {
            minHeight: '100vh',
            height: '100%',
            maxWidth: 250,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

export default function RepositoryPage() {
    const classes = useStyles();

    let [loading, setLoading] = useState<boolean>(false);
    let [repositories, setRepositories] = useState<any[]>([]);
    let [unfilteredList, setUnfilteredList] = useState<any[]>([]);
    let [languageList, setLanguageList] = useState<string[]>([]);


    function getLanguageList(prList: any[]) {
        // @ts-ignore
        const result: string[] = _.map(
            _.groupBy(prList, 'language'),
            (prList: PullRequest, language: string) => (language)
        )

        setLanguageList(result);
    }

    function getRepositoriesList() {
        setLoading(true);
        fetch("/api/projects")
            .then((data) => {
                data.json()
                    .then((list) => {
                        console.log(list)
                        setUnfilteredList(list)
                        filterListByArchived(false, list)
                        getLanguageList(list)
                    }).catch((error) => {
                    console.error(error)
                })
            }).catch((error) => {
            console.error("get failed")
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        getRepositoriesList()
        // setRepositories(pullRequestList)
    }, []);

    let [languageToggle, setLanguageToggle] = useState<string>("")
    let [archiveToggle, setArchiveToggle] = useState<boolean>(false)
    let [privateToggle, setPrivateToggle] = useState<boolean>(false)

    function filterListByArchived(toggle: boolean = archiveToggle, list = unfilteredList) {
        setArchiveToggle(toggle)
        list = list.map((x) => x);
        if (!toggle) {
            _.remove(list, function (item: Repository) {
                return item.archived
            });
        }
        setRepositories(list)
    }

    function filterListByPrivate(toggle: boolean = archiveToggle, list = unfilteredList) {
        setPrivateToggle(toggle)
        list = list.map((x) => x);
        if (toggle) {
            _.remove(list, function (item: Repository) {
                return !item.private
            });
        }
        setRepositories(list)
    }

    function filterListByLanguage(language_to_filter: string = languageToggle) {
        console.info("filterList")
        console.log(languageToggle)
        console.warn(unfilteredList.length)
        let list = unfilteredList.map((x) => x);
        if (language_to_filter !== languageToggle) {
            list = _.remove(list, function (item: Repository) {
                let language: string = item.language
                if (language === null) language = "";
                return !language.search(language_to_filter);
            });

        } else {
            language_to_filter = ""
        }
        setLanguageToggle(language_to_filter)
        console.log(list.length)
        filterListByArchived(archiveToggle, list)
    }

    return (
        <>
            {loading && <LinearProgress color="secondary"/>}
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <div className={classes.list}>
                        {
                            loading ?
                                <div className={classes.languageCircle}><CircularProgress/></div>
                                :
                                <>
                                    <List subheader={<ListSubheader>Languages</ListSubheader>}>
                                        {
                                            languageList.map((item) => {
                                                return (
                                                    <ListItem key={item}>
                                                        <ListItemText id="switch-list-label-wifi" primary={item}/>
                                                        <ListItemSecondaryAction>
                                                            <Switch
                                                                checked={(languageToggle === item)}
                                                                onChange={() => filterListByLanguage(item)}
                                                                name="checkedB"
                                                                color="primary"
                                                                edge="end"
                                                                inputProps={{'aria-labelledby': 'switch-list-label-wifi'}}
                                                            />
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                    <Divider/>
                                    <List subheader={<ListSubheader>Archived</ListSubheader>}>
                                        <ListItem>
                                            <ListItemText id="switch-list-label-wifi" primary={"Show archived"}/>
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={archiveToggle}
                                                    onChange={() => filterListByArchived(!archiveToggle)}
                                                    name="checkedB"
                                                    color="primary"
                                                    edge="end"
                                                    inputProps={{'aria-labelledby': 'switch-list-label-wifi'}}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                    <List subheader={<ListSubheader>Private</ListSubheader>}>
                                        <ListItem>
                                            <ListItemText id="switch-list-label-wifi" primary={"Show only Private"}/>
                                            <ListItemSecondaryAction>
                                                <Switch
                                                    checked={privateToggle}
                                                    onChange={() => filterListByPrivate(!privateToggle)}
                                                    name="checkedB"
                                                    color="primary"
                                                    edge="end"
                                                    inputProps={{'aria-labelledby': 'switch-list-label-wifi'}}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </>
                        }

                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div className={classes.root}>
                        <RepositoryAccordionList list={repositories}/>

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
        </>


    );
}