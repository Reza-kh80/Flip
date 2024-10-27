import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// import MUI Components
import {
    Autocomplete,
    Typography,
    TextField,
    keyframes,
    Button,
    Modal,
    Box,
} from '@mui/material';

// import components
import ListItemBox from './ListItemBox';

// import SVG
import searchInput from '@/public/Icons/search-input.svg';

// import styles
const shakeLabel = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const styleModalOption = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 275,
    height: 275,
    gap: '0',
    borderRadius: '15px',
    borderTopWidth: '3px',
    borderBottomWidth: '6px',
    background: "#FFFFFF",
    borderWidth: '3px, 3px, 5px, 3px',
    borderStyle: 'solid',
    borderColor: '#133266',
    p: 3
};

type Value = {
    label: string,
    type: string,
    description: string,
    example: string,
    id: string | number
}

interface Props {
    cards: Value[]
}

const CardReviewPage = ({ cards }: Props) => {
    const { push, asPath } = useRouter();
    
    const [isFocused, setIsFocused] = useState(false);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [card, setCard] = useState<Value[]>(cards);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);
    const [height, setHeight] = useState(0);

    const filteredOptions = useMemo(() =>
        card.filter(option => option.label.toLowerCase().includes((search || '').toLowerCase())),
        [search, card]);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = useCallback((event: React.SyntheticEvent<Element, Event>, value: string | Value | null) => {
        setSearch(typeof value === 'string' || value === null ? undefined : value.label);
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteId !== null) {
            setCard(currentItems => currentItems.filter(i => i.id !== deleteId));
            setOpenModal(false);
            setDeleteId(null);
        }
    }, [deleteId]);

    const onDeleteAction = useCallback((id: number | string) => {
        setDeleteId(id);
        setOpenModal(true);
    }, []);

    const onEditAction = useCallback((id: number | string, label: string) => {
        push(`/edit-word/${label}-${asPath.split('/')[2]}-${id}`);
        localStorage.setItem('path', asPath);
    }, [push, asPath]);

    return (
        <>
            <div className='position-relative' style={{ marginTop: '35px' }}>
                <Autocomplete
                    freeSolo
                    value={search}
                    onChange={handleChange}
                    sx={{ border: '1px solid #133266', "& fieldset": { border: 'none' }, backgroundColor: '#AEBED6', borderRadius: '20px' }}
                    renderInput={(params) => (
                        <div style={{ position: 'relative' }}>
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <Image priority src={searchInput} alt='search' width={24} height={24} />
                                    ),
                                    sx: {
                                        animation: isFocused ? `${shakeLabel} 0.3s ease-in-out` : '',
                                    },
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
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
            <div className='scrollable-div' style={{ overflowY: 'scroll', height: `${height - 260}px` }}>
                {filteredOptions.map((item, index) => (
                    <ListItemBox
                        {...item}
                        key={item.id}
                        index={index}
                        onDeleteAction={onDeleteAction}
                        onEditAction={onEditAction}
                    />
                ))}
            </div>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModalOption}>
                    <Typography id="modal-modal-title" variant="h6" component="h2"
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            lineHeight: '23.14px',
                            textAlign: 'left',
                            color: '#133266',
                        }}>
                        Are You Sure You Want To Delete This Word From The Cards Box?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 10 }} display='flex' alignItems='center' justifyContent='space-between' flexDirection='row'>
                        <Button className='cancel-style' onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button className='delete-style' onClick={confirmDelete}>Delete</Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default CardReviewPage;