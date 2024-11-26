import React, { useState, Fragment, useEffect } from "react";
import { CreateAlertFunction } from "@/types/common";
import { getCookie } from "cookies-next";
import axiosInstance from "@/helper/axiosInstance";

// import components
import {
  Container,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent
} from "@mui/material";
import Layout from "@/components/Layout";
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

export default function Home({ createAlert }: ComponentProps) {
  const [token, setToken] = useState<boolean>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    const accessToken = getCookie('accessToken');
    setToken(accessToken !== undefined);

    if (accessToken) {
      fetchUserProfile();
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
      <Layout title="Home">
        <main className='bg-main-home'>
          <Container maxWidth='sm' className='p-4'>
            <div className='d-flex flex-row justify-content-between align-items-center'>
              {loading ? (
                <Box sx={{ width: 70, height: 70 }} /> // Placeholder while loading
              ) : !token ? (
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
          </Container>
        </main>
      </Layout>
    </Fragment>
  );
}