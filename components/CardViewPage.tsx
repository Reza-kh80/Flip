import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { useRouter } from 'next/router';
import Image from 'next/image';

// import Swiper
import { Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';

// import context
import { clickChecking } from '@/context/Exceptional';

// import MUI
import { Box, Button, Grid } from '@mui/material';

// import SVG
import volumeUp from '../public/Icons/volume-up.svg';
import happy from '../public/Icons/happy.svg';
import edit from '../public/Icons/edit.svg';
import star from '../public/Icons/star.svg';
import sad from '../public/Icons/sad.svg';

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

const CardViewPage = ({ data, createAlert }: Props) => {
    const { push, asPath } = useRouter();
    const { handleChangeNextViewCounter, handleChangePrevViewCounter } = clickChecking();

    const swiperRef = useRef<SwiperType | null>(null);
    const [prevIndex, setPrevIndex] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        const currentIndex = swiper.activeIndex;
        setCurrentIndex(currentIndex);
        const isNext = currentIndex > prevIndex;
        setIsFlipped(false);
        isNext ? handleChangeNextViewCounter() : handleChangePrevViewCounter();
        setPrevIndex(currentIndex);
    }, [prevIndex, handleChangeNextViewCounter, handleChangePrevViewCounter]);

    const handleEditClick = useCallback((label: string, id: number) => {
        push(`/edit-word/${label}-${data.title}-${id}`);
        localStorage.setItem('path', asPath);
    }, [push, asPath, data.title]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        setStartTime(Date.now());
    };

    const slideToNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleForgot = () => {
        const endTime = Date.now();
        const difference = endTime - startTime;

        axiosInstance.post(`/card/review/${data.initialBoxes[currentIndex].id}`, {
            rating: 'FORGET',
            duration: difference
        }).then((res) => {
            slideToNext();
            createAlert(res.data.message + '_success', 5);
        }).catch((error) => {
            createAlert('An error occurred. Please try again._error', 5);
        })
    }

    const handleSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;

            // Set specific voice if available
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(voice => voice.lang === 'en-US');
            if (voice) {
                utterance.voice = voice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            createAlert('Text-to-speech is not supported in this browser._error', 5);
        }
    };

    const handleKnow = () => {
        const endTime = Date.now();
        const difference = endTime - startTime;

        axiosInstance.post(`/card/review/${data.initialBoxes[currentIndex].id}`, {
            rating: 'KNOW',
            duration: difference
        }).then((res) => {
            slideToNext();
            createAlert(res.data.message + '_success', 5);
        }).catch((error) => {
            createAlert('An error occurred. Please try again._error', 5);
        })
    };

    const renderCardFace = (slide: Card, isFront: boolean) => (
        <div className={`card-face card-${isFront ? 'front' : 'back'}`}>
            <Box className='d-flex flex-row-reverse justify-content-between w-100 align-items-center'>
                <section>
                    <Button style={{ minWidth: '0' }}>
                        <Image priority src={star} alt="star" height={24} width={24} />
                    </Button>
                    <Button style={{ minWidth: '0' }} onClick={() => handleEditClick(slide.front, slide.id)}>
                        <Image priority src={edit} alt="edit" height={24} width={24} />
                    </Button>
                </section>
                <section>
                    <Button style={{ minWidth: '0' }}>
                        <Image priority src={volumeUp} onClick={() => handleSpeech(slide.front)} alt="volumeUp" height={24} width={24} />
                    </Button>
                </section>
                {!isFront && <section className='type-design'>{slide.type}</section>}
            </Box>
            {isFront ? (
                <>
                    <Box component='h2' mt={18} className='fw-bold' fontSize={40} color='#133266'>{slide.front}</Box>
                    <Box mt={18}>
                        <Button className='flip-btn' onClick={handleFlip}>Flip</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box mt={10} color='#133266' display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                        <Box component='h2' fontWeight='bold' fontSize={40}>{slide.front}</Box>
                        <Box mt={4}>{slide.back.definition}</Box>
                        <Box mt={2}>{slide.back.example}</Box>
                    </Box>
                    <Grid container spacing={1} display='flex' alignItems='center' justifyContent='space-between' flexDirection='row' mt={10}>
                        <Grid xs={6} item>
                            <Button startIcon={<Image priority src={sad} alt="sad" height={24} width={24} />} onClick={handleForgot} className='forgot-btn'>Forgot</Button>
                        </Grid>
                        <Grid xs={6} item>
                            <Button onClick={handleKnow} startIcon={<Image priority src={happy} alt="happy" height={24} width={24} />} className='know-btn'>Know</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );

    return (
        <Fragment>
            <div style={{ height: `${height - 120}px` }} className='d-flex align-items-center'>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    grabCursor={true}
                    effect={'creative'}
                    creativeEffect={{
                        prev: { shadow: true, translate: ['-120%', 0, -500] },
                        next: { shadow: true, translate: ['120%', 0, -500] },
                    }}
                    modules={[EffectCreative]}
                    className="mySwiper2"
                    onSlideChange={handleSlideChange}
                    style={{ width: '300px', height: '500px' }}
                >
                    {data.initialBoxes.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="card-container">
                                <div className={`card ${isFlipped ? 'flipped' : ''}`} style={{ border: 'none' }}>
                                    {renderCardFace(slide, true)}
                                    {renderCardFace(slide, false)}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </Fragment>
    );
};

export default CardViewPage;
