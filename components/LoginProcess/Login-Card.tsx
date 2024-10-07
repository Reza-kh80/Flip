import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

// import axios
import axiosInstance from '@/helper/axiosInstance';

// import MUI
import {
    Grid,
    Button,
    TextField,
    Box,
    keyframes,
} from '@mui/material';

// create animation for switch
const fadeIn = keyframes`
    0% {
        transform: scale(0) rotateY(180deg);
    }

    100% {
        transform: scale(1) rotateY(0deg);
    }
`;

const fadeOut = keyframes`
    0% {
        transform: scale(0) rotateY(0deg);
    }

    100% {
        transform: scale(1) rotateY(360deg);
    }
`;

const Login_Card = () => {
    const router = useRouter();

    // import state of log-in    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // import state of sign up
    const [signUpEmail, setSignUpEmail] = useState<string>('');
    const [signUpPassword, setSignUpPassword] = useState<string>('');
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>('');

    // import state og sign up validation 
    const [signUpEmailError, setSignUpEmailError] = useState<string>('');
    const [signUpPasswordError, setSignUpPasswordError] = useState<string>('');
    const [signUpConfirmPasswordError, setSignUpConfirmPasswordError] = useState<string>('');

    // import state of log-in validation 
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // state for animation 
    const [loginStep, setLoginStep] = useState<boolean>(true);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEmailError('');
        setPasswordError('');

        if (email === "" && password === "") {
            setEmailError('Email is required!');
            setPasswordError('Password is required!');
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError('Email is invalid!');
            return;
        }

        if (password.length < 8) {
            setPasswordError('Password must be more than 8 characters.');
            return;
        }

        try {
            const response = await axiosInstance.post('/users/login', {
                email,
                password
            });

            // Store both tokens
            setCookie("accessToken", response.data.accessToken);
            setCookie("refreshToken", response.data.refreshToken);

            // Update axios instance to use the new access token
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

            router.push('/flip');
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setPasswordError('Password is incorrect!');
                        break;
                    case 404:
                        setEmailError('User does not exist!');
                        break;
                    default:
                        setEmailError('An error occurred. Please try again.');
                }
            }
        }
    };

    const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSignUpEmailError('');
        setSignUpPasswordError('');
        setSignUpConfirmPasswordError('');

        if (!signUpEmail || !signUpPassword || !signUpConfirmPassword) {
            setSignUpEmailError(!signUpEmail ? 'Email is required!' : '');
            setSignUpPasswordError(!signUpPassword ? 'Password is required!' : '');
            setSignUpConfirmPasswordError(!signUpConfirmPassword ? 'Confirm password is required!' : '');
            return;
        }

        if (!isValidEmail(signUpEmail)) {
            setSignUpEmailError('Email is invalid!');
            return;
        }

        if (signUpPassword.length < 8) {
            setSignUpPasswordError('Password must be more than 8 characters.');
            return;
        }

        if (signUpConfirmPassword !== signUpPassword) {
            setSignUpConfirmPasswordError('Passwords do not match.');
            return;
        }

        try {
            const response = await axiosInstance.post('/users/signup', {
                email: signUpEmail,
                password: signUpPassword
            });

            // Store both tokens
            setCookie("accessToken", response.data.accessToken);
            setCookie("refreshToken", response.data.refreshToken);

            // Update axios instance to use the new access token
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

            router.push('/flip');
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setSignUpEmailError('Email address is already in use.');
            } else {
                setSignUpEmailError('An error occurred. Please try again.');
            }
        }
    };

    const handleToggleForm = () => {
        setLoginStep((prev) => !prev);
    }

    return (
        <Box
            sx={{
                marginTop: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: `${loginStep ? fadeIn : fadeOut} 1s ease`
            }}
        >
            {
                loginStep ? (
                    <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            value={email}
                            placeholder='FlipIt@gmail.com'
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '20px',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    fontSize: '12pt'
                                },
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                        />
                        <TextField
                            placeholder='******'
                            value={password}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '20px',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    fontSize: '12pt'
                                },
                            }}
                            sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                            className='mt-5'
                        />

                        <Grid container className='mt-5'>
                            <Grid item xs>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className='main-button me-2'
                                    style={{ width: '50%' }}
                                >
                                    Log in
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSignUpSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            value={signUpEmail}
                            placeholder='FlipIt@gmail.com'
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '20px',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    fontSize: '12pt'
                                },
                            }}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            error={!!signUpEmailError}
                            helperText={signUpEmailError}
                            sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                        />
                        <TextField
                            placeholder='Password'
                            value={signUpPassword}
                            margin="normal"
                            required
                            fullWidth
                            name="signup-password"
                            type="signup-password"
                            id="signup-password"
                            autoComplete="signup-password"
                            variant="outlined"
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            error={!!signUpPasswordError}
                            helperText={signUpPasswordError}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '20px',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    fontSize: '12pt'
                                },
                            }}
                            sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                            className='mt-3'
                        />
                        <TextField
                            placeholder='Confirm Password'
                            value={signUpConfirmPassword}
                            margin="normal"
                            required
                            fullWidth
                            name="signup-confirm-password"
                            type="signup-confirm-password"
                            id="signup-confirm-password"
                            autoComplete="signup-confirm-password"
                            variant="outlined"
                            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                            error={!!signUpConfirmPasswordError}
                            helperText={signUpConfirmPasswordError}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '20px',
                                },
                            }}
                            FormHelperTextProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    fontSize: '12pt'
                                },
                            }}
                            sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                            className='mt-3'
                        />
                        <Grid container className='mt-5'>
                            <Grid item xs className='mt-4'>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className='main-button me-2'
                                    style={{ width: '80%' }}
                                >
                                    Sign up
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }
            <Grid container className='mt-4'>
                <Grid item xs>
                    <Button sx={{ fontSize: "9pt" }}
                        className='text-white fw-bold hover-text'
                        onClick={handleToggleForm}
                    >
                        {loginStep ? 'Register or Forgot Password' : 'Back to Login'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login_Card;