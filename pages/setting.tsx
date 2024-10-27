import React from 'react';
import { CreateAlertFunction } from "@/types/common";

// import MUI Components
import { Container } from '@mui/material';

// import main layer and other components
import Layout from '@/components/Layout';
import SettingStructure from '@/components/SettingStructure';

interface ComponentProps {
    createAlert: CreateAlertFunction;
}

const Setting = ({ createAlert }: ComponentProps) => {
    return (
        <Layout title='Setting'>
            <main className='bg-setting'>
                <Container maxWidth='xs' className='p-5'>
                    <h2 className='fw-bold' style={{ color: '#133266', fontSize: '35pt' }}>
                        Setting
                    </h2>
                    <SettingStructure createAlert={createAlert} />
                </Container>
            </main>
        </Layout >
    )
}

export default Setting;