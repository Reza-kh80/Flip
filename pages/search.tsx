import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { getSession } from 'next-auth/react';
import React from 'react';

// import MUI Components
import { Container } from '@mui/material';

// import main layer
import Layout from '@/components/Layout';
import CardReviewPage from '@/components/ReviewPage/CardReviewPage';

interface Card {
    id: number;
    box_id: number;
    front: string;
    back: {
        example: string,
        definition: string
    };
    type: string;
    voice_url: string,
    is_favorite: boolean,
    srs_interval: number,
    ease_factor: string,
    due_date: number,
    created_at: number,
    updated_at: number | null,
    deleted_at: number | null
}

interface Props {
    data: {
        initialBoxes: Card[];
    };
    createAlert: CreateAlertFunction;
}

const Search = ({ data, createAlert }: Props) => {
    return (
        <Layout title='Search'>
            <main className='bg-search'>
                <Container maxWidth='sm' className='p-4'>
                    <h2 className='fw-bold' style={{ color: '#133266', fontSize: '35pt' }}>
                        Search
                    </h2>
                    <CardReviewPage cards={data.initialBoxes} createAlert={createAlert} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

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
        const response = await axiosInstance.get<Card[]>(`/card/get-all-cards`, {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
        });

        return {
            props: {
                data: {
                    initialBoxes: response.data
                }
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
                data: {
                    initialBoxes: []
                }
            },
        };
    }
};


export default Search;