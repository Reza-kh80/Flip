import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { axiosInstanceSSR } from '@/helper/axiosInstanceSSR';
import { CreateAlertFunction } from '@/types/common';
import { Container } from '@mui/material';
import Layout from '@/components/Layout';
import EditWordsPage from '@/components/EditWordsPage';
import leftSquare from '@/public/Icons/left-square.svg';

interface Card {
    id: number;
    box_id: number;
    front: string;
    back: {
        example: string,
        definition: string
    };
    type: string;
    voice_url: string;
    is_favorite: boolean;
    srs_interval: number;
    ease_factor: string;
    due_date: number;
    created_at: number;
    updated_at: number | null;
    deleted_at: number | null;
}

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

interface Props_SSR {
    card: Card;
    initialBoxes: Box[];
}

interface EditWordProps {
    card: Card;
    initialBoxes: Box[];
    createAlert: CreateAlertFunction;
}

const EditWord = ({ card, initialBoxes, createAlert }: EditWordProps) => {
    const { push, asPath } = useRouter();

    const backToReviewPage = () => {
        push(`/review/${asPath.split('/')[2].split('-')[1]}`);
    }

    return (
        <Layout title="Edit Word">
            <main className='bg-edit'>
                <Container maxWidth='sm' className='p-4'>
                    <div className='d-flex flex-row align-items-center'>
                        <span className='cursor-pointer' onClick={backToReviewPage}>
                            <Image priority src={leftSquare} alt='left-square' width={32} height={32} />
                        </span>
                        <h2 className='fw-bold ms-4' style={{ color: '#133266', fontSize: '35pt' }}>
                            Edit Word
                        </h2>
                    </div>
                    <EditWordsPage card={card} initialBoxes={initialBoxes} createAlert={createAlert} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<Props_SSR> = async (context) => {
    const axiosInstance = axiosInstanceSSR(context as any);
    const { resolvedUrl } = context;

    const url_details = decodeURIComponent(resolvedUrl).split('/');
    const id = parseInt(url_details[2].split('-')[2]);

    try {
        const response = await axiosInstance.get<Card>(`/card/get-card/${id}`);
        const responseBox = await axiosInstance.get<Box[]>('/boxes/get-all');

        return {
            props: {
                card: response.data,
                initialBoxes: responseBox.data,
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

        // Create a default Card object that matches the Card interface
        const defaultCard: Card = {
            id: 0,
            box_id: 0,
            front: '',
            back: {
                example: '',
                definition: ''
            },
            type: '',
            voice_url: '',
            is_favorite: false,
            srs_interval: 0,
            ease_factor: '0',
            due_date: 0,
            created_at: 0,
            updated_at: null,
            deleted_at: null
        };

        return {
            props: {
                card: defaultCard,
                initialBoxes: [],
            }
        };
    }
};

export default EditWord;