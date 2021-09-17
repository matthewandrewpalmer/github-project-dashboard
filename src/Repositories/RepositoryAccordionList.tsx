import React, {Fragment} from 'react';
import {Repository} from "../interfaces";
import {CircularProgress} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import RepositoryItem from "./RepositoryItem";

interface Props {
    list: Repository[]
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // flexGrow: 1,
            padding: theme.spacing(2)
        },
        circle: {
            textAlign: "center",
            paddingTop: theme.spacing(20),
        }
    }),
);

const RepositoryAccordionList = ({list}: Props) => {
    const classes = useStyles();

    return (
        <>
            {
                list.length === 0 ?
                    <div className={classes.circle}>
                        <CircularProgress/>
                    </div>
                    :
                    list.map((repository: Repository) => {
                        return (
                            <Fragment key={repository.id}>
                                <RepositoryItem repository={repository}/>
                            </Fragment>
                        )
                    })
            }
        </>
    );
};

export default RepositoryAccordionList;