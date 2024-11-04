import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { axiosInstanceSSR } from '@/helper/axiosInstanceSSR';
import { CreateAlertFunction } from '@/types/common';

// import MUI Components
import { Container } from '@mui/material';

// import main layer
import Layout from '@/components/Layout';

// import context
import { clickChecking } from '@/context/Exceptional';

// import components
import CardViewPage from '@/components/CardViewPage';

// import SVG
import swap from '@/public/Icons/swap.svg';

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

const CardView = ({ data, createAlert }: Props) => {
    const { push } = useRouter();

    // add context
    const { cardViewCounter, setOutCardViewCounter } = clickChecking();

    const backToReview = () => {
        push(`/review/${data.title}`)
    }

    useEffect(() => {
        setOutCardViewCounter(1);
    }, [])

    return (
        <Layout title='Cards View'>
            <div className='bg-card-title-view'>
                <Container maxWidth='sm' className='p-3'>
                    <div className='d-flex flex-row align-items-center justify-content-between mt-2'>
                        <span onClick={backToReview}>
                            <h2 style={{ color: "white", cursor: 'pointer' }}>Done</h2>
                        </span>
                        <span className='cursor-pointer'>
                            <Image priority src={swap} alt='swap' width={32} height={32} />
                        </span>
                    </div>
                    <div className='d-flex flex-row align-items-center justify-content-center mt-4'>
                        <h4 style={{ color: "white" }}>
                            {cardViewCounter <= data.initialBoxes.length ? cardViewCounter : data.initialBoxes.length} of {data.initialBoxes.length}
                        </h4>
                    </div>
                </Container>
            </div>
            <div className='bg-card-view-body'>
                <Container maxWidth='sm' className='p-4'>
                    <CardViewPage data={data} createAlert={createAlert} />
                </Container>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const axiosInstance = axiosInstanceSSR(context as any);

    const { resolvedUrl } = context;
    const url_details = decodeURIComponent(resolvedUrl).split('/');
    const title = url_details[url_details.length - 1];

    try {
        const response = await axiosInstance.get<Card[]>(`/card/due/${title}`);
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
            return {
                redirect: {
                    destination: '/',
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
            }
        };
    }
};

export default CardView;