import React, { useState, useEffect, useCallback } from 'react';
import { CreateAlertFunction } from '@/types/common';
import axiosInstance from '@/helper/axiosInstance';
import { useRouter } from 'next/router';
import Image from 'next/image';

import {
    SelectChangeEvent,
    FormHelperText,
    FormControl,
    TextField,
    MenuItem,
    Select,
    Box,
} from '@mui/material';

// import SVG
import downCircle from '../public/Icons/down-circle.svg';

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

interface AddWordsPageProps {
    initialBoxes: Box[];
    createAlert: CreateAlertFunction;
}

const AddWordsPage = ({ initialBoxes, createAlert }: AddWordsPageProps) => {
    const { reload } = useRouter();
    const [formData, setFormData] = useState({
        label: '',
        type: '',
        description: '',
        example: '',
        cardBox: '',
    });
    const [errors, setErrors] = useState({
        label: '',
        type: false,
        description: '',
        example: '',
        cardBox: false,
    });

    const [height, setHeight] = useState(0);
    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = useCallback(() => {
        const newErrors = {
            label: formData.label ? '' : 'Word is required!',
            type: !formData.type,
            description: formData.description ? '' : 'Description is required!',
            example: formData.example ? '' : 'Example is required!',
            cardBox: !formData.cardBox,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    }, [formData]);

    const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            axiosInstance.post('/card/create', {
                box_id: formData.cardBox,
                front: formData.label,
                back: {
                    definition: formData.description,
                    example: formData.example
                },
                type: formData.type,
            }).then(() => {
                createAlert("Word added successfully!_success", 5);
            }).catch((error) => {
                createAlert('An error occurred. Please try again._error', 5);
            })
        }
    };

    useEffect(() => {
        const addAddWords = () => {
            const designNavbarElement = document.querySelector('.design-navbar');
            if (designNavbarElement && !document.querySelector('.add-words')) {
                const newCardsBoxElement = document.createElement('div');
                newCardsBoxElement.className = 'add-words';
                newCardsBoxElement.innerHTML = `
                    <button class='btn-add-words' type='submit'>
                        <Image priority src="/Icons/edit-square.svg" alt="edit-square" width={24} height={24} />
                        Add to Cards
                    </button>
                `;
                designNavbarElement.insertBefore(newCardsBoxElement, designNavbarElement.firstChild);

                newCardsBoxElement.querySelector('.btn-add-words')?.addEventListener('click', () => {
                    document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                });
            }
        };
        addAddWords();
    }, []);

    return (
        <Box component="form" role='form' data-testid="add-words-form" onSubmit={handleSaveChanges} noValidate sx={{ overflowY: 'scroll', height: `${height - 240}px` }} display='flex' flexDirection="column" className='scrollable-div'>
            <FormControl fullWidth>
                <TextField
                    value={formData.label}
                    placeholder='Enter The Word...'
                    margin="normal"
                    required
                    fullWidth
                    id="label"
                    name="label"
                    autoComplete="label"
                    autoFocus
                    variant="outlined"
                    InputProps={{
                        sx: {
                            backgroundColor: '#EFC1C4',
                            borderRadius: '50px',
                            border: '3px solid var(--Indigo, #133266)',
                            fontWeight: 'bold',
                            mt: 5
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            fontSize: '12pt'
                        },
                    }}
                    onChange={handleChange}
                    error={!!errors.label}
                    helperText={errors.label}
                    sx={{ border: 'none', "& fieldset": { border: 'none' }, }}
                />
            </FormControl>

            <hr style={{ backgroundColor: '#133266', height: '3px' }} />

            <FormControl>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.type}
                    name="type"
                    label="Type"
                    onChange={handleChange}
                    defaultValue='nothing'
                    displayEmpty
                    aria-label="Select Tag"
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '50px',
                        border: '2px solid var(--Indigo, #133266)',
                        width: '170px',
                        mt: 3,
                        '& .MuiSelect-select': {
                            padding: '10px 14px',
                            width: '50%'
                        },
                    }}
                    IconComponent={() => (
                        <Image priority src={downCircle} alt="down-circle" width={25} height={25} />
                    )}
                >
                    <MenuItem value=""><em>Select Tag</em></MenuItem>
                    {['NOUN', 'ADJ', 'ADV', 'VERB'].map(item => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                </Select>
                {errors.type && (
                    <FormHelperText
                        sx={{
                            color: 'var(--Indigo, #ef3427)',
                            fontWeight: 'bold',
                            fontSize: '11pt',
                            marginTop: '8px',
                        }}
                    >
                        Please select a type
                    </FormHelperText>
                )}
            </FormControl>

            <FormControl sx={{ mt: 5 }}>
                <TextField
                    id="outlined-multiline-static"
                    placeholder='Enter the Description...'
                    multiline
                    maxRows={4}
                    minRows={4}
                    inputProps={{ maxLength: 250 }}
                    value={formData.description}
                    name="description"
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            borderRadius: '10px',
                            border: '3px solid #133266',
                            backgroundColor: '#AEBED6'
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            fontSize: '12pt'
                        },
                    }}
                    error={!!errors.description}
                    helperText={errors.description}
                />
            </FormControl>

            <FormControl sx={{ mt: 3 }}>
                <TextField
                    id="outlined-multiline-static"
                    placeholder='Enter the Example...'
                    multiline
                    maxRows={2}
                    minRows={2}
                    inputProps={{ maxLength: 125 }}
                    value={formData.example}
                    name="example"
                    onChange={handleChange}
                    InputProps={{
                        sx: {
                            borderRadius: '10px',
                            border: '3px solid #133266',
                            backgroundColor: '#AEBED6'
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            fontSize: '12pt'
                        },
                    }}
                    error={!!errors.example}
                    helperText={errors.example}
                />
            </FormControl>

            <FormControl fullWidth>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.cardBox}
                    name="cardBox"
                    label="Age"
                    onChange={handleChange}
                    displayEmpty
                    aria-label="Search for Box Cards"
                    sx={{
                        backgroundColor: '#EFC1C4',
                        borderRadius: '50px',
                        border: '2px solid var(--Indigo, #133266)',
                        mt: 5,
                        '& .MuiSelect-select': {
                            padding: '15px 14px',
                            width: '85%'
                        },
                    }}
                    IconComponent={() => (
                        <Image priority src={downCircle} alt="down-circle" width={25} height={25} />
                    )}
                >
                    <MenuItem value=""><em>Search for Box Cards</em></MenuItem>
                    {initialBoxes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                </Select>
                {errors.cardBox && (
                    <FormHelperText
                        sx={{
                            color: 'var(--Indigo, #ef3427)',
                            fontWeight: 'bold',
                            fontSize: '11pt',
                            marginTop: '8px',
                        }}
                    >
                        Please select a Card Box
                    </FormHelperText>
                )}
            </FormControl>
        </Box>
    );
};
export default AddWordsPage;
