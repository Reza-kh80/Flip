import { CreateAlertFunction } from '@/types/common';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// import components
import Login_Card from './Login-Card';

// import MUI
import {
    Grid,
    Box,
    Typography,
    Container,
} from '@mui/material';

interface ComponentProps {
    createAlert: CreateAlertFunction;
}


function Copyright() {
    return (
        <>
            <Typography
                variant="body2"
                color="#133266"
                fontWeight='bold'
                fontSize='14pt'
                align="center"
                className='mt-5'
            >
                FlipIt
            </Typography>
            <Typography variant="body2"
                color="#133266"
                fontWeight='bold'
                align="center"
                className='mb-3 mt-2'
            >
                {'All Right Reserved '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </>
    );
}

const Login = ({ createAlert }: ComponentProps) => {
    // spinner
    const [spinner, setSpinner] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSpinner(false);
        }, 3000);

        // Clean up the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Grid
                container
                spacing={2}
                className='bg-login'
                display='flex'
                flexDirection='row'
                justifyContent='center'
                alignItems='center'
                textAlign='center'
            >
                {
                    spinner ?
                        <Box sx={{ display: 'flex' }} >
                            <Image
                                className='animation-show-login'
                                src='/Images/Flipit-Logo-WB.svg'
                                width={200}
                                height={200}
                                priority
                                alt='spinner'
                            />
                        </Box >
                        :
                        <Container component="main" maxWidth="xs" className='design-login'>
                            <Login_Card createAlert={createAlert} />
                            <Copyright />
                        </Container>
                }

            </Grid>
        </div>
    )
}

export default Login;
