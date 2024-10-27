import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

// import MUI Components
import { Container } from '@mui/material';

// import main layer and other components
import Layout from '@/components/Layout';

// import components
import EditWordsPage from '@/components/EditWordsPage';

// import SVG
import leftSquare from '@/public/Icons/left-square.svg';
interface Props {
    data: {
        chiocedWord: {
            label: string,
            description: string,
            example: string
            type: string
            id: number
        },
        cardsBox: {
            label: string,
            number: number,
            id: number
        }[],
        chiocedCardBox: {
            label: string,
            number: number,
            id: number
        }
    };
}

const EditWord = ({ data }: Props) => {
    const { push, asPath } = useRouter();

    const backToReviewPage = () => {
        push(`/review/${asPath.split('/')[2].split('-')[1]}`);
    }

    return (
        <Layout title={`Edit Word`}>
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
                    <EditWordsPage chiocedWord={data.chiocedWord} cardsBox={data.cardsBox} chiocedCardBox={data.chiocedCardBox} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const { resolvedUrl } = context;

    const url_details = decodeURIComponent(resolvedUrl).split('/');
    const id = parseInt(url_details[2].split('-')[2]);
    const boxName = url_details[2].split('-')[1];

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
    const chiocedWord = data.find((item) => item.id === id);

    const cardsBox = [
        {
            label: 'Common Verbs',
            number: 253,
            id: 1
        },
        {
            label: 'Dommon Verbs',
            number: 300,
            id: 2
        },
        {
            label: 'Xommon Verbs',
            number: 265,
            id: 3
        },
        {
            label: 'Aommon Verbs',
            number: 265,
            id: 4
        },
        {
            label: 'Wommon Verbs',
            number: 265,
            id: 5
        },
        {
            label: 'Rommon Verbs',
            number: 265,
            id: 6
        },
        {
            label: 'Tommon Verbs',
            number: 265,
            id: 7
        }
    ]
    const chiocedCardBox = cardsBox.find((item) => item.label === boxName);

    return {
        props: {
            data: {
                chiocedWord,
                cardsBox,
                chiocedCardBox
            }
        }
    };
};

export default EditWord;