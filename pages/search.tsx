import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { getSession } from 'next-auth/react';
import React from 'react';

// import MUI Components
import { Container } from '@mui/material';

// import main layer
import Layout from '@/components/Layout';
import SearchPage from '@/components/SearchPage/SearchPage';

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

interface PaginatedResponse {
    cards: Card[];
    totalPages: number;
    currentPage: number;
    totalCards: number;
}

interface Props {
    data: {
        initialBoxes: Card[];
        pagination: {
            totalPages: number;
            currentPage: number;
            totalCards: number;
        };
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
                    <SearchPage
                        cards={data.initialBoxes}
                        createAlert={createAlert}
                        totalPages={data.pagination.totalPages}
                    />
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

        const page = Number(context.query.page) || 1;
        const limit = 10;

        // Update the endpoint to match backend route
        const response = await axiosInstance.get<PaginatedResponse>(`/card/get-all-cards`, {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
            params: {
                page,
                limit
            }
        });

        return {
            props: {
                data: {
                    initialBoxes: response.data.cards,
                    pagination: {
                        totalPages: response.data.totalPages,
                        currentPage: response.data.currentPage,
                        totalCards: response.data.totalCards
                    }
                }
            },
        };
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
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
                    initialBoxes: [],
                    pagination: {
                        totalPages: 0,
                        currentPage: 1,
                        totalCards: 0
                    }
                }
            },
        };
    }
};

export default Search;