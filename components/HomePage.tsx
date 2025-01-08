import React, { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCards } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const languageFeatures = [
    {
        name: 'AI Pronunciation',
        icon: '🎯',
        description: 'Perfect your accent with AI-powered pronunciation feedback'
    },
    {
        name: 'Smart Flashcards',
        icon: '🔄',
        description: 'Adaptive learning system that evolves with your progress'
    },
    {
        name: 'Voice Recognition',
        icon: '🎤',
        description: 'Practice speaking and get instant feedback'
    },
    {
        name: 'Context Learning',
        icon: '🧠',
        description: 'AI generates relevant example sentences for better retention'
    },
    {
        name: 'Progress Tracking',
        icon: '📊',
        description: 'Smart analytics to monitor your learning journey'
    }
];

const popularLanguages = [
    {
        name: 'English',
        icon: '/Images/English.webp',
        learners: '1.5B learners'
    },
    {
        name: 'Spanish',
        icon: '/Images/Spanish.webp',
        learners: '534M learners'
    },
    {
        name: 'French',
        icon: '/Images/French.webp',
        learners: '280M learners'
    },
    {
        name: 'Japanese',
        icon: '/Images/Japanese.webp',
        learners: '128M learners'
    }
];

export default function HomePage() {
    return (
        <Fragment>
            <div className='position-relative z-0'>
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

                <div className="language-features" style={{ marginTop: '80px' }}>
                    <div className="features-navigation">
                        <button className="custom-swiper-button prev-button" id="feature-prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button className="custom-swiper-button next-button" id="feature-next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    <Swiper
                        modules={[Autoplay, Navigation]}  
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '#feature-prev',
                            nextEl: '#feature-next',
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="features-swiper"
                    >
                        {languageFeatures.map((feature, index) => (
                            <SwiperSlide key={index}>
                                <div className="feature-card">
                                    <div className="icon-container">
                                        <span className="feature-icon">{feature.icon}</span>
                                    </div>
                                    <h3 className="feature-title">{feature.name}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="popular-languages mt-4 mb-4">
                    <h2 className="text-center mb-4 text-2xl font-bold">
                        Popular Languages to Learn
                    </h2>
                    <Swiper
                        modules={[EffectCards, Autoplay]}
                        effect="cards"
                        grabCursor={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        className="language-cards-swiper"
                    >
                        {popularLanguages.map((language, index) => (
                            <SwiperSlide key={index}>
                                <div className="language-card">
                                    <div className="flag-container">
                                        <Image
                                            src={language.icon}
                                            alt={language.name}
                                            width={120}
                                            height={80}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <h3 className="language-name">{language.name}</h3>
                                    <p className="learners-count">{language.learners}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </Fragment>
    )
}