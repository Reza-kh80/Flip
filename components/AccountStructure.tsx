import React, { useState, useEffect } from 'react';
import {
    TextField,
    FormControl,
    Box,
    InputAdornment,
    IconButton
} from '@mui/material';
import { CreateAlertFunction } from "@/types/common";
import axiosInstance from '@/helper/axiosInstance';
import { useRouter } from 'next/router';

// SVG Icons as components
const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#133266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const PasswordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#133266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#133266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#133266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#133266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

interface User {
    id: number;
    email: string;
    password: string;
    access_token: string;
    refresh_token: string;
    created_at: number | null;
    updated_at: number | null;
    deleted_at: number | null;
}

interface AccountStructureProps {
    user: User;
    createAlert: CreateAlertFunction;
}

const AccountStructure = ({ user, createAlert }: AccountStructureProps) => {
    const { push } = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ password?: string }>({});

    const commonTextFieldStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            backgroundColor: '#fff',
            '&:hover fieldset': {
                borderColor: '#133266',
                borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#133266',
                borderWidth: '2px',
            },
            '&.Mui-disabled': {
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                    borderColor: '#133266',
                    borderWidth: '2px',
                }
            }
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#133266',
            borderWidth: '2px',
        },
        '& .MuiInputLabel-root': {
            color: '#133266',
            '&.Mui-focused': {
                color: '#133266',
            },
            '&.Mui-disabled': {
                color: '#133266',
            }
        },
        '& .MuiFormHelperText-root': {
            marginLeft: '16px',
            fontSize: '12pt'
        },
        mb: 5
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        if (newPassword.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters long' });
        } else {
            setErrors({});
        }
    };

    useEffect(() => {
        const addUpdate = () => {
            const designNavbarElement = document.querySelector('.design-navbar');
            if (designNavbarElement && !document.querySelector('.add-update')) {
                const newCardsBoxElement = document.createElement('div');
                newCardsBoxElement.className = 'add-update';
                newCardsBoxElement.innerHTML = `
                    <button class='btn-add-update' type='submit'>
                        <Image priority src="/Icons/edit-square.svg" alt="edit-square" width={24} height={24} />
                        Update your Profile
                    </button>
                `;
                designNavbarElement.insertBefore(newCardsBoxElement, designNavbarElement.firstChild);

                newCardsBoxElement.querySelector('.btn-add-update')?.addEventListener('click', () => {
                    document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                });
            }
        };
        addUpdate();
    }, []);

    const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password.length >= 8) {
            axiosInstance.patch('/users/update-profile', {
                password
            }).then((res) => {
                createAlert(`${res.data.message}_success`, 5);
                push('/setting');
            }).catch((error) => {
                createAlert('An error occurred. Please try again._error', 5);
            })
        }
    }


    return (
        <Box component="form" role='form' data-testid="account-form" sx={{ mt: 4, maxWidth: 'sm', mx: 'auto', p: 3 }} onSubmit={handleSaveChanges}>

            <FormControl fullWidth>
                <TextField
                    fullWidth
                    disabled
                    label="Email"
                    value={user.email}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={commonTextFieldStyle}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PasswordIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={commonTextFieldStyle}
                />

                <TextField
                    fullWidth
                    disabled
                    label="Created At"
                    value={new Date(user.created_at || 0).toLocaleDateString()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CalendarIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={commonTextFieldStyle}
                />

            </FormControl>
        </Box>
    );
};

export default AccountStructure;