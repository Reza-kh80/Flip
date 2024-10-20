import { GetServerSideProps } from 'next';
import { Container } from '@mui/material';
import Layout from '@/components/Layout';
import CardHomePage from '@/components/HomePage/CardHomePage';
import { axiosInstanceSSR } from '@/helper/axiosInstanceSSR';

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

interface BoxesPageProps {
    initialBoxes: Box[];
}


const Home = ({ initialBoxes }: BoxesPageProps) => {

    return (
        <Layout title='Cards Box'>
            <main className='bg-home'>
                <Container maxWidth='sm' className='p-4'>
                    <h2 className='fw-bold' style={{ color: '#133266', fontSize: '35pt' }}>
                        Cards Box
                    </h2>
                    <CardHomePage initialBoxes={initialBoxes} />
                </Container>
            </main>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps<BoxesPageProps> = async (context) => {
    const axiosInstance = axiosInstanceSSR(context as any);

    try {
        const response = await axiosInstance.get<Box[]>('/boxes/get-all');
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
                    destination: '/',
                    permanent: false,
                },
            };
        }

        // Return empty array if there's an error
        return {
            props: {
                initialBoxes: [],
            },
        };
    }
};

export default Home;