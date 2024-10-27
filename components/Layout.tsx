import React, { ReactNode, Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// import components
import Navbar from './Navbar';

type Props = {
    title: string,
    children: ReactNode
}

const Layout = ({ title, children }: Props) => {
    const { asPath } = useRouter();

    return (
        <Fragment>
            <Head>
                <title>{`Flip – ${title}`}</title>
            </Head>
            <div className='d-flex flex-column justify-content-between align-items-center' style={asPath.includes('card-view') ? { overflowY: 'hidden', height: '100vh' } : { height: '100vh' }}  >
                {children}
                {
                    !asPath.includes('card-view') ?
                        <Navbar />
                        :
                        null
                }
            </div>
        </Fragment>
    )
}

export default Layout;