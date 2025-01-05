import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';

// import MUI Components
import { Container } from '@mui/material';

// import main layer and other components
import Layout from '@/components/Layout';
import ReviewPage from '@/components/ReviewPage/ReviewPage';

// import SVG
import leftSquare from '@/public/Icons/left-square.svg';
import play from '@/public/Icons/play.svg';

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
        title: string;
        initialBoxes: Card[];
    };
    createAlert: CreateAlertFunction;
}

interface Props_SSR {
    data: {
        title: string;
        initialBoxes: Card[];
    };
}

const Review = ({ data, createAlert }: Props) => {

    const { push } = useRouter();

    const backToHomePage = () => {
        push('/flip');
    }

    const goToCardView = () => {
        push(`/card-view/${data.title}`);
    }

    return (
        <Layout title={`Review – ${data.title}`}>
            <main className='bg-search'>
                <Container maxWidth='sm' className='p-4'>
                    <div className='d-flex flex-row align-items-center justify-content-between'>
                        <span className='cursor-pointer' onClick={backToHomePage}>
                            <Image priority src={leftSquare} alt='left-square' width={32} height={32} />
                        </span>
                        <h2 className='fw-bold' style={{ color: '#133266' }}>
                            {data.title}
                        </h2>
                        <span className='cursor-pointer' onClick={goToCardView}>
                            <Image priority src={play} alt='play' width={32} height={32} />
                        </span>
                    </div>
                    <ReviewPage createAlert={createAlert} cards={data.initialBoxes} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Props_SSR> = async (context) => {

    const title = context.resolvedUrl.split('/')[2];

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
        const response = await axiosInstance.get<Card[]>(`/card/get-cards/${title}`, {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
        });

        return {
            props: {
                data: {
                    title,
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
                    title: '',
                    initialBoxes: []
                }
            },
        };
    }
};

export default Review;