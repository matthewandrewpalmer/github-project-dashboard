import {Repository} from "../interfaces";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Divider,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {formatText} from "../functions/TextFormmating";
import TimeAgo from "react-timeago";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import RepositoryBadges from "./RepositoryBadges";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            padding: theme.spacing(0.5),
            fontSize: theme.typography.pxToRem(17),
            fontWeight: theme.typography.fontWeightRegular,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
            marginTop: 7
        },
        column: {
            flexBasis: '33.33%',
        },
        helper: {
            borderLeft: `2px solid ${theme.palette.divider}`,
            padding: theme.spacing(1, 2),
        },
        chip: {
            marginLeft: 6
        },
        circle: {
            textAlign: "center",
            paddingTop: theme.spacing(20),
        }
    }),
);

interface Props {
    repository: Repository
}

function RepositoryItem({repository}: Props) {

    const classes = useStyles();

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <div className={classes.column}>
                    <Typography className={classes.heading}>{formatText(repository.name)}</Typography>
                </div>
                <div className={classes.column}>
                    <Chip color="primary" className={classes.chip} label={repository.language}/>
                    {
                        repository.open_issues_count > 0 &&
                        <Chip className={classes.chip}
                              color={"secondary"}
                              label={`Pull requests: ${repository.open_issues_count}`}/>
                    }

                    {
                        repository.private && <Chip className={classes.chip}
                                                    label={"Private"}/>
                    }
                </div>
                <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                        Last updated: <TimeAgo live={false} date={repository.updated_at}/>
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.column}>

                    <Typography>
                        {repository.description ? repository.description : "Repository has no description."}
                    </Typography>

                    {/*<Accordion>*/}
                    {/*    <AccordionSummary*/}
                    {/*        expandIcon={<ExpandMoreIcon/>}*/}
                    {/*        aria-controls="panel1a-content"*/}
                    {/*        id="panel1a-header"*/}
                    {/*    >*/}
                    {/*        <Typography className={classes.heading}>View Pull Requests</Typography>*/}
                    {/*    </AccordionSummary>*/}
                    {/*    <AccordionDetails>*/}
                    {/*        Hello*/}
                    {/*    </AccordionDetails>*/}
                    {/*</Accordion>*/}
                </div>
                <div className={classes.column}/>
                <div className={clsx(classes.column, classes.helper)}>
                    {
                        (
                            repository.private ?
                                <Typography variant="body1" gutterBottom>
                                    Repository is private, information not available.
                                </Typography>
                                :
                                <RepositoryBadges fullName={repository.full_name}
                                                  text={repository.name}
                                                  language={repository.language}/>
                        )
                    }

                </div>
            </AccordionDetails>
            <Divider/>
            <AccordionActions>
                <Button target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        color="primary"
                        href={repository.html_url}>
                    Open repo
                </Button>
                <Button target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        color="secondary"
                        href={`${repository.html_url}/pulls`}>
                    Pull requests
                </Button>
            </AccordionActions>
        </Accordion>
    )
}

export default RepositoryItem;