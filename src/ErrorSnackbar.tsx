import React from 'react';
import {Snackbar} from "@material-ui/core";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const ErrorSnackbar = () => {
    // TODO: Make snackbar better by allowing to pass in error message and error state.
    function Alert(props: JSX.IntrinsicAttributes & AlertProps) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity="error">
                This is an error message!
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackbar;