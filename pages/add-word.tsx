import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';

// import MUI Components
import { Container } from '@mui/material';

// import main layer
import Layout from '@/components/Layout';

// import components
import AddWordsPage from '@/components/AddWordsPage';

interface Box {
    id: number;
    user_id: number;
    name: string;
    language_code: string;
    created_at: number;
    updated_at: number | null;
    deleted_at: number | null;
    _count: {
        cards: number;
    };
}

// Combined props interface for the main component
interface AddWordProps {
    initialBoxes: Box[];
    createAlert: CreateAlertFunction;
}

const AddWord = ({ initialBoxes, createAlert }: AddWordProps) => {
    return (
        <Layout title='Add Word'>
            <main className='bg-edit'>
                <Container maxWidth='sm' className='p-4'>
                    <div className='d-flex flex-row align-items-center'>
                        <h2 className='fw-bold' style={{ color: '#133266', fontSize: '35pt' }}>
                            Add Word
                        </h2>
                    </div>
                    <AddWordsPage initialBoxes={initialBoxes} createAlert={createAlert} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<{ initialBoxes: Box[] }> = async (context) => {

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

        const response = await axiosInstance.get<Box[]>('/boxes/get-all', {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
        });

        return {
            props: {
                initialBoxes: response.data,
            },
        };
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            // Redirect to login page if unauthorized
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        return {
            props: {
                initialBoxes: [],
            },
        };
    }
};

export default AddWord;