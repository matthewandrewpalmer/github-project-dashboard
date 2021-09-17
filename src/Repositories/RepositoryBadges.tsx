import {formatText} from "../functions/TextFormmating";
import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        githubBadgeBlock: {
            float: "left"
        },
        githubBadge: {
            marginTop: 10,
            marginLeft: 6
        },
        chip: {
            marginLeft: 6
        }
    }),
);

interface Props {
    fullName: string,
    text: string,
    language: string
}

function RepositoryBadges({fullName, language, text}: Props) {
    const classes = useStyles();

    language = (language === "TypeScript" ? "javascript" : language)

    return (
        <div className={classes.githubBadgeBlock}>
            <a href={`https://github.com/${fullName}/graphs/contributors`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    src={`https://img.shields.io/github/contributors/${fullName}.svg`}
                    alt={"contributors badge"}/>
            </a>

            <a href={`https://github.com/${fullName}/commits`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    src={`https://img.shields.io/github/last-commit/${fullName}.svg`}
                    alt={"Last commit badge"}/>
            </a>

            <a href={`https://github.com/${fullName}/releases`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    src={`https://img.shields.io/github/release/${fullName}.svg?style=flat-square`}
                    alt={`${formatText(text)} release version`}/>
            </a>


            <a href={`https://codecov.io/gh/${fullName}`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    src={`https://codecov.io/gh/${fullName}/branch/main/graph/badge.svg?token=R0mEgR7R61`}
                    alt={"Code coverage badge"}/>
            </a>


            <a href={`https://lgtm.com/projects/g/${fullName}/context:${language}`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    alt={`Language grade: ${language}`}
                    src={`https://img.shields.io/lgtm/grade/${language.toLowerCase()}/g/${fullName}.svg?logo=lgtm&logoWidth=18`}/>
            </a>

            <a href={`https://lgtm.com/projects/g/${fullName}/alerts/`}
               target="_blank"
               rel="noopener noreferrer"
               className={classes.githubBadge}>
                <img
                    alt="Total alerts"
                    src={`https://img.shields.io/lgtm/alerts/g/${fullName}.svg?logo=lgtm&logoWidth=18`}/>
            </a>
        </div>
    );
}


export default RepositoryBadges;