import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// import MUI Components
import {
    TextField,
    Autocomplete,
    keyframes,
    Box,
    Modal
} from '@mui/material';

// import context
import { clickChecking } from '@/context/Exceptional';

// import components
import EffectiveCard from '../EffectiveCard';
import ListItem from './ListItem';

// import SVG
import searchInput from '@/public/Icons/search-input.svg';

// import styles
const shakeLabel = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const EffectStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "transparent",
    border: "none",
    outline: "none",
    p: 4,
};

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

const CardHomePage = (initialBoxes: BoxesPageProps) => {

    const { push } = useRouter();
    const { openEffectCard, handleChangeClick } = clickChecking();

    const [search, setSearch] = useState<string | undefined>(undefined);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [card, setCard] = useState<Box[]>(initialBoxes.initialBoxes);
    const [filteredOptions, setFilteredOptions] = useState<Box[]>([]);
    const [height, setHeight] = useState<number>(0);

    const handleChange = useCallback((event: React.SyntheticEvent<Element, Event>, value: string | Box | null) => {
        setSearch(typeof value === 'string' || value === null ? undefined : value.name);
    }, []);

    const addNewCardsBox = useCallback(() => {
        const designNavbarElement = document.querySelector('.design-navbar');
        if (designNavbarElement && !document.querySelector('.new-cards-box')) {
            const newCardsBoxElement = document.createElement('div');
            newCardsBoxElement.className = 'new-cards-box';
            newCardsBoxElement.innerHTML = `
            <button class='btn-new-cards-box'>
                <Image priority src="/Icons/paper-plus.svg" alt="paper-plus" width={24} height={24} />
                New Cards Box
            </button>
        `;
            designNavbarElement.insertBefore(newCardsBoxElement, designNavbarElement.firstChild);
            newCardsBoxElement.querySelector('.btn-new-cards-box')?.addEventListener('click', () => push('/add-card-box'));
        }
    }, [push]);

    const addFlipItOption = useCallback(() => {
        const designNavbarElement = document.querySelector('.design-navbar');
        if (designNavbarElement && !document.querySelector('.flip-it-box')) {
            const newCardsBoxElement = document.createElement('div');
            newCardsBoxElement.className = 'flip-it-box';
            newCardsBoxElement.innerHTML = `
            <button class='btn-flip-it'>
                <Image priority src="/Icons/swap-left.svg" alt="swap" width={24} height={24} />
                Flipit
            </button>
      `;
            designNavbarElement.insertBefore(newCardsBoxElement, designNavbarElement.firstChild);
            newCardsBoxElement.querySelector('.btn-flip-it')?.addEventListener('click', () => push('/card-view/totally'));
        }
    }, [push]);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        addNewCardsBox();
        addFlipItOption();
    }, [addNewCardsBox, addFlipItOption]);

    useEffect(() => {
        setFilteredOptions(card?.filter(option =>
            option.name.toLowerCase().includes((search || '').toLowerCase())
        ));
    }, [search, card]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const onCompleteLeft = useCallback((id: number | string) => {
        setFilteredOptions(currentItems => currentItems.filter(i => i.id !== id));
        setCard(currentItems => currentItems.filter(i => i.id !== id));
    }, []);

    const onCompleteRight = useCallback(() => {
        handleChangeClick();
    }, [handleChangeClick]);

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 }
    ];

    return (
        <Fragment>
            <div className='position-relative' style={{ marginTop: '35px' }}>
                <Autocomplete
                    freeSolo
                    value={search}
                    onChange={handleChange}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    sx={{ border: '1px solid #133266', "& fieldset": { border: 'none' }, backgroundColor: '#EFC1C4', borderRadius: '20px' }}
                    renderInput={(params) => (
                        <div style={{ position: 'relative' }}>
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <Image priority src={searchInput} alt="search" width={24} height={24} />
                                    ),
                                    sx: {
                                        animation: isFocused ? `${shakeLabel} 0.3s ease-in-out` : '',
                                    },
                                }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            {search === undefined && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 40,
                                        transform: isFocused ? 'translate(-30px, -40px)' : '',
                                        padding: '0 5px',
                                        pointerEvents: 'none',
                                        transition: 'transform 0.3s ease-in-out',
                                        fontSize: '15px',
                                        color: '#133266'
                                    }}
                                >
                                    Search for a Cards Box
                                </Box>
                            )}
                        </div>
                    )}
                    options={filteredOptions}
                    fullWidth
                />
            </div>
            <div className='scrollable-div' style={{ overflowY: 'scroll', height: `${height - 381}px` }}>
                {filteredOptions?.map((item, index) => (
                    <ListItem
                        {...item}
                        key={item.id}
                        index={index}
                        onCompleteLeft={onCompleteLeft}
                        onCompleteRight={onCompleteRight}
                    />
                ))}
            </div>
            {openEffectCard && (
                <Modal
                    open={openEffectCard}
                    onClose={handleChangeClick}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={EffectStyle}>
                        <EffectiveCard data={top100Films} />
                    </Box>
                </Modal>
            )}
        </Fragment>
    )
}

export default CardHomePage;   