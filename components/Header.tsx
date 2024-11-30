import React, { useState, Fragment, useEffect } from "react";
import { CreateAlertFunction } from "@/types/common";
import axiosInstance from "@/helper/axiosInstance";
import { getCookie } from "cookies-next";
import { useSessionMonitor } from "@/helper/auth-protection";

// import components
import {
    Avatar,
    Box,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface ComponentProps {
    createAlert: CreateAlertFunction;
}

interface UserProfile {
    id: number;
    email: string;
    profile_picture?: string;
    created_at: number;
    updated_at?: number;
}


const Header = ({ createAlert }: ComponentProps) => {
    const [token, setToken] = useState<boolean>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { status } = useSessionMonitor();



    const fetchUserProfile = async () => {
        try {
            const response = await axiosInstance.get('/users/profile');
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            createAlert('Failed to load user profile_error', 5);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUserProfile();
            setToken(true);
        } else {
            setLoading(false);
        }
    }, []);

    const getImageUrl = (url?: string) => {
        if (!url) return undefined;
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL}/${url}`;
    };

    return (
        <Fragment>
            <div className='d-flex flex-row justify-content-between align-items-center'>
                {loading ? (
                    <Box sx={{ width: 70, height: 70 }} /> // Placeholder while loading
                ) : status == 'unauthenticated' ? (
                    <Link href='/login' className="fw-bold" style={{ color: '#133266', fontSize: '14pt' }}>
                        Log In
                    </Link>
                ) : (
                    <Box>
                        <Avatar
                            src={profile?.profile_picture ? getImageUrl(profile.profile_picture) : undefined}
                            sx={{
                                width: 65,
                                height: 65,
                                backgroundColor: '#133266',
                                // Optional: add hover effect for better UX
                                '&:hover': {
                                    opacity: 0.9,
                                    cursor: 'pointer'
                                }
                            }}
                            alt={profile?.email || 'User'}
                        >
                            {!profile?.profile_picture && profile?.email.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                )}
                <Image
                    src='/Images/Logo.webp'
                    alt="Logo"
                    width={101}
                    height={68}
                    priority
                />
            </div>
        </Fragment>
    )
}

export default Header;