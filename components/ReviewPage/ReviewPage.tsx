import React, { useState, useEffect, useCallback } from 'react';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
    Autocomplete,
    Typography,
    TextField,
    keyframes,
    Button,
    Modal,
    Box,
    AutocompleteChangeReason,
    AutocompleteChangeDetails,
    Pagination,
} from '@mui/material';

import ListItemBox from '../CommonList';
import searchInput from '@/public/Icons/search-input.svg';

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
    cards: Card[];
    createAlert: CreateAlertFunction;
    totalPages: number;
}

const ReviewPage = ({ cards, createAlert, totalPages }: Props) => {
    const { push, asPath } = useRouter();
    const ITEMS_PER_PAGE = 10;

    const [isFocused, setIsFocused] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [card, setCard] = useState<Card[]>(cards);
    const [openModal, setOpenModal] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<Card[]>([]);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);
    const [height, setHeight] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchCards = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/card/get-all-cards', {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE
                }
            });
            setCard(response.data.cards);
            setLoading(false);
        } catch (error) {
            createAlert('Failed to fetch cards._error', 5);
            setLoading(false);
        }
    }, [createAlert]);

    useEffect(() => {
        fetchCards(currentPage);
    }, [currentPage, fetchCards]);

    useEffect(() => {
        setFilteredOptions(card?.filter(option =>
            option.front.toLowerCase().includes((selectedCard?.front || '').toLowerCase())
        ));
    }, [selectedCard, card]);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleChange = useCallback(
        (
            _event: React.SyntheticEvent<Element, Event>,
            value: string | Card | null,
            reason: AutocompleteChangeReason,
            _details?: AutocompleteChangeDetails<Card>
        ) => {
            setSelectedCard(typeof value === 'object' ? value : null);
        },
        []
    );

    const confirmDelete = useCallback(async () => {
        if (deleteId !== null) {
            try {
                const res = await axiosInstance.delete(`/card/delete-card/${deleteId}`);
                if (res.status === 204) {
                    createAlert("Word deleted successfully!_success", 5);
                    // Refresh the current page after deletion
                    await fetchCards(currentPage);
                }
            } catch (error) {
                createAlert('An error occurred. Please try again._error', 5);
            }

            setOpenModal(false);
            setDeleteId(null);
        }
    }, [deleteId, createAlert, currentPage, fetchCards]);

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
                    value={selectedCard}
                    onChange={handleChange}
                    getOptionLabel={(option: string | Card) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        return option?.front || '';
                    }}
                    sx={{
                        border: '1px solid #133266',
                        "& fieldset": { border: 'none' },
                        backgroundColor: '#AEBED6',
                        borderRadius: '20px'
                    }}
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
                            {!selectedCard && (
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
            <div className='scrollable-div' style={{ overflowY: 'scroll', height: `${height - 320}px` }}>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    filteredOptions.map((item, index) => (
                        <ListItemBox
                            {...item}
                            key={item.id}
                            index={index}
                            onDeleteAction={onDeleteAction}
                            onEditAction={onEditAction}
                        />
                    ))
                )}
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#133266',
                            '&.Mui-selected': {
                                backgroundColor: '#133266',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1a4080',
                                },
                            },
                        },
                    }}
                />
            </Box>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModalOption}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            lineHeight: '23.14px',
                            textAlign: 'left',
                            color: '#133266',
                        }}
                    >
                        Are You Sure You Want To Delete This Word From The Cards Box?
                    </Typography>
                    <Typography
                        id="modal-modal-description"
                        sx={{ mt: 10 }}
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        flexDirection='row'
                    >
                        <Button className='cancel-style' onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button className='delete-style' onClick={confirmDelete}>Delete</Button>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};

export default ReviewPage;