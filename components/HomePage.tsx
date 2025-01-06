import React, { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';

export default function HomePage() {
    return (
        <Fragment>
            <div className="mt-5 flip-style">
                <Image
                    src='/Images/Logo.webp'
                    alt='logo'
                    width={101}
                    height={68}
                    priority
                />
            </div>
            <div className='hero-style mt-4'>
                <p className='h1 text-center font-bold'>
                    One Step To Learning
                    Just Flip It
                </p>
                <p className='mt-2'>
                    Flashcard is most famous way to learn new language. Flipit is a open source app to help learning new language. So Let's set it up and flipit!
                </p>
            </div>
        </Fragment>
    )
}