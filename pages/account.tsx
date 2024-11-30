import { CreateAlertFunction } from "@/types/common";
import axiosInstance from "@/helper/axiosInstance";
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import React from 'react';

// import MUI Components
import { Container } from '@mui/material';

// import main layer and other components
import Layout from '@/components/Layout';
import AccountStructure from '@/components/AccountStructure';

interface User {
    id: number;
    email: string;
    password: string;
    profile_picture: string | null;
    access_token: string;
    refresh_token: string;
    created_at: number | null;
    updated_at: number | null;
    deleted_at: number | null;
}
interface AccountStructureProps {
    user: User,
    createAlert: CreateAlertFunction;
}

const Account = ({ createAlert, user }: AccountStructureProps) => {
    return (
        <Layout title='Account'>
            <main className='bg-account'>
                <Container maxWidth='sm' className='p-4'>
                    <h2 className='fw-bold' style={{ color: '#133266', fontSize: '35pt' }}>
                        Account Details
                    </h2>
                </Container>
                <AccountStructure createAlert={createAlert} user={user} />
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (context) => {

    try {
        const session = await getSession(context);

        if (!session) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        // Pass the cookie header to maintain session in SSR
        const response = await axiosInstance.get<User>('/users/profile', {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
        });

        return {
            props: {
                user: response.data,
            },
        };
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
};
export default Account;