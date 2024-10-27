import * as React from 'react';
import { Snackbar, styled } from '@mui/material';
import Alert, { AlertProps } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type ToasterPosition = {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
};

type ToasterProps = {
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success' | string;
    position?: ToasterPosition;
    autoHideDuration?: number;
};

const StyledAlert = styled(Alert)<AlertProps>(({ severity }) => ({
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '300px',
    maxWidth: '500px',
    padding: '12px 16px',

    // Custom colors for each severity
    ...(severity === 'error' && {
        backgroundColor: '#FDE8E8',
        color: '#DC2626',
        '& .MuiAlert-icon': {
            color: '#DC2626',
        },
    }),
    ...(severity === 'warning' && {
        backgroundColor: '#FEF3C7',
        color: '#D97706',
        '& .MuiAlert-icon': {
            color: '#D97706',
        },
    }),
    ...(severity === 'info' && {
        backgroundColor: '#E0F2FE',
        color: '#0284C7',
        '& .MuiAlert-icon': {
            color: '#0284C7',
        },
    }),
    ...(severity === 'success' && {
        backgroundColor: '#DCFCE7',
        color: '#16A34A',
        '& .MuiAlert-icon': {
            color: '#16A34A',
        },
    }),
}));

function isAlertColor(severity: string): severity is 'error' | 'warning' | 'info' | 'success' {
    return ['error', 'warning', 'info', 'success'].includes(severity);
}

export default function Toaster({
    message,
    severity,
    position = { vertical: 'bottom', horizontal: 'left' },
    autoHideDuration = 5000
}: ToasterProps) {
    if (!isAlertColor(severity)) {
        throw new Error(`Invalid severity level: ${severity}`);
    }

    const [open, setOpen] = React.useState(true);
    const { vertical, horizontal } = position;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            sx={{
                '& .MuiSnackbar-root': {
                    transition: 'all 0.3s ease-in-out',
                },
            }}
        >
            <StyledAlert
                severity={severity}
                variant="standard"
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                {message}
            </StyledAlert>
        </Snackbar>
    );
}