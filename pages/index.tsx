import React, { useState, Fragment, useEffect } from "react";
import { CreateAlertFunction } from "@/types/common";
import { getCookie } from "cookies-next";

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
  name: string;
  email: string;
  photo?: string;
}

export default function Home({ createAlert }: ComponentProps) {
  const [token, setToken] = useState<boolean>();
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",  // Replace with actual user data
    email: "john@example.com",  // Replace with actual user data
    photo: undefined
  });

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    setToken(accessToken !== undefined);

    // Load saved photo from localStorage if exists
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
      setProfile((prevProfile) => ({ ...prevProfile, photo: savedPhoto }));
    }
  }, []);

  return (
    <Fragment>
      <Layout title="Home">
        <main className='bg-main-home'>
          <Container maxWidth='sm' className='p-4'>
            <div className='d-flex flex-row justify-content-between align-items-center'>
              {
                !token ? (
                  <Link href='/login' className="fw-bold" style={{ color: '#133266', fontSize: '14pt' }}>
                    Log In
                  </Link>
                ) : (
                  <Box>
                    <Avatar
                      src={profile.photo || undefined}
                      sx={{ width: 70, height: 70, backgroundColor: '#133266' }}
                      alt={profile.name}
                    >
                      {!profile.photo && profile.name.charAt(0)}
                    </Avatar>
                  </Box>
                )
              }
              <Image
                src='/Images/Logo.webp'
                alt="Logo"
                width={101}
                height={68}
              />
            </div>
          </Container>
        </main>
      </Layout>
    </Fragment>
  );
}