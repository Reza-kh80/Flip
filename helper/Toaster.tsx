import * as React from 'react';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

type props = {
    message: string,
    severity: 'error' | 'warning' | 'info' | 'success' | string
}

function isAlertColor(severity: string): severity is 'error' | 'warning' | 'info' | 'success' {
    return ['error', 'warning', 'info', 'success'].includes(severity);
}

export default function Toaster({ message, severity }: props) {

    if (!isAlertColor(severity)) {
        throw new Error(`Invalid severity level: ${severity}`);
    }

    const [state, setState] = React.useState({
        open: true,
        vertical: 'bottom' as const,
        horizontal: 'left' as const,
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <div>
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={open}>
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}