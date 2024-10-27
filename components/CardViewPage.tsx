import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
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

type Slide = {
    label: string;
    description: string;
    example: string;
    type: string;
    id: number;
};

type Props = {
    slides: Slide[];
    title: string;
};

const CardViewPage = ({ slides, title }: Props) => {
    const { push, asPath } = useRouter();
    const { handleChangeNextViewCounter, handleChangePrevViewCounter } = clickChecking();
    
    const swiperRef = useRef(null);
    const [prevIndex, setPrevIndex] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        const currentIndex = swiper.activeIndex;
        const isNext = currentIndex > prevIndex;
        setIsFlipped(false);
        isNext ? handleChangeNextViewCounter() : handleChangePrevViewCounter();
        setPrevIndex(currentIndex);
    }, [prevIndex, handleChangeNextViewCounter, handleChangePrevViewCounter]);

    const handleEditClick = useCallback((label: string, id: number) => {
        push(`/edit-word/${label}-${title}-${id}`);
        localStorage.setItem('path', asPath);
    }, [push, asPath, title]);

    const renderCardFace = (slide: Slide, isFront: boolean) => (
        <div className={`card-face card-${isFront ? 'front' : 'back'}`}>
            <Box className='d-flex flex-row-reverse justify-content-between w-100 align-items-center'>
                <section>
                    <Button style={{ minWidth: '0' }}>
                        <Image priority src={star} alt="star" height={24} width={24} />
                    </Button>
                    <Button style={{ minWidth: '0' }} onClick={() => handleEditClick(slide.label, slide.id)}>
                        <Image priority src={edit} alt="edit" height={24} width={24} />
                    </Button>
                </section>
                <section>
                    <Button style={{ minWidth: '0' }}>
                        <Image priority src={volumeUp} alt="volumeUp" height={24} width={24} />
                    </Button>
                </section>
                {!isFront && <section className='type-design'>{slide.type}</section>}
            </Box>
            {isFront ? (
                <>
                    <Box component='h2' mt={18} className='fw-bold' fontSize={40} color='#133266'>{slide.label}</Box>
                    <Box mt={18}>
                        <Button className='flip-btn' onClick={() => setIsFlipped(true)}>Flip</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box mt={10} color='#133266' display='flex' justifyContent='center' flexDirection='column' alignItems='center'>
                        <Box component='h2' fontWeight='bold' fontSize={40}>{slide.label}</Box>
                        <Box mt={4}>{slide.description}</Box>
                        <Box mt={2}>{slide.example}</Box>
                    </Box>
                    <Grid container spacing={1} display='flex' alignItems='center' justifyContent='space-between' flexDirection='row' mt={10}>
                        <Grid xs={6} item>
                            <Button startIcon={<Image priority src={sad} alt="sad" height={24} width={24} />} className='forgot-btn'>Forgot</Button>
                        </Grid>
                        <Grid xs={6} item>
                            <Button onClick={() => setIsFlipped(false)} startIcon={<Image priority src={happy} alt="happy" height={24} width={24} />} className='know-btn'>Know</Button>
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
                    ref={swiperRef}
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
                    {slides.map((slide) => (
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
