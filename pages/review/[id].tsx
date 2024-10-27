import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

// import MUI Components
import { Container } from '@mui/material';

// import main layer and other components
import Layout from '@/components/Layout';
import CardReviewPage from '@/components/ReviewPage/CardReviewPage';

// import SVG
import leftSquare from '@/public/Icons/left-square.svg';
import play from '@/public/Icons/play.svg';

interface Props {
    data: {
        title: string;
        data: []
    };
}

const Review = ({ data }: Props) => {
    const { push } = useRouter();

    const backToHomePage = () => {
        push('/flip');
    }

    const goToCardView = () => {
        push(`/card-view/${data.title}`);
    }

    return (
        <Layout title={`Review-${data.title}`}>
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
                    <CardReviewPage cards={data.data} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { resolvedUrl } = context;

    const url_details = decodeURIComponent(resolvedUrl).split('/');
    const title = url_details[url_details.length - 1];

    const data = [
        {
            label: 'Eat',
            type: 'Verb',
            description: `put (food) into the mouth and chew and swallow it.`,
            example: `"he was eating a hot dog"`,
            id: 1
        },
        {
            label: 'Snack',
            type: 'Noun',
            description: `put (food) into the mouth and chew and swallow it.`,
            example: `"he was eating a hot dog"`,
            id: 2
        },
        {
            label: 'Hello',
            type: 'Adverb',
            description: `put (food) into the mouth and chew and swallow it.`,
            example: `"he was eating a hot dog"`,
            id: 3
        },
        {
            label: 'Honey',
            type: 'Adjective',
            description: `put (food) into the mouth and chew and swallow it.`,
            example: `"he was eating a hot dog"`,
            id: 4
        },
        {
            label: 'Pure',
            type: 'Verb',
            description: `put (food) into the mouth and chew and swallow it.`,
            example: `"he was eating a hot dog"`,
            id: 5
        },
    ]

    return {
        props: {
            data: {
                title,
                data
            }
        }
    };
};

export default Review;