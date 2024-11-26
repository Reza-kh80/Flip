import { axiosInstanceSSR } from '@/helper/axiosInstanceSSR';
import { CreateAlertFunction } from "@/types/common";
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
    const axiosInstance = axiosInstanceSSR(context as any);

    try {
        const response = await axiosInstance.get<User>('/users/profile');
        return {
            props: {
                user: response.data,
            },
        };
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            // Redirect to login page if unauthorized
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        // Return empty user object if there's an error
        return {
            props: {
                user: {} as User,
            },
        };
    }
};
export default Account;