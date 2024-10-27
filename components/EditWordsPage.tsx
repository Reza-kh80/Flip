import React, { useState, useEffect, Fragment } from 'react';
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

interface Props {
    chiocedWord: {
        label: string,
        description: string,
        example: string,
        type: string,
        id: number
    },
    cardsBox: {
        label: string,
        number: number,
        id: number
    }[],
    chiocedCardBox: {
        label: string,
        number: number,
        id: number
    }
}

const EditWordsPage = ({ chiocedWord, cardsBox, chiocedCardBox }: Props) => {
    const { push } = useRouter();
    const [formState, setFormState] = useState({
        label: chiocedWord.label,
        type: chiocedWord.type,
        description: chiocedWord.description,
        example: chiocedWord.example,
        cardBox: chiocedCardBox.label,
    });
    const [errors, setErrors] = useState({
        label: '',
        type: false,
        description: '',
        example: '',
        cardBox: false,
    });

    const [height, setHeight] = useState<number>(0);
    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {
            label: formState.label ? '' : 'Word is required!',
            type: !formState.type,
            description: formState.description ? '' : 'Description is required!',
            example: formState.example ? '' : 'Example is required!',
            cardBox: !formState.cardBox,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    };

    const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateForm()) {
            const path = localStorage.getItem('path');
            if (path) {
                push(path);
                localStorage.removeItem('path');
            }
        }
    };

    useEffect(() => {
        const addSaveChanges = () => {
            const designNavbarElement = document.querySelector('.design-navbar');
            if (designNavbarElement && !document.querySelector('.save-change')) {
                const newCardsBoxElement = document.createElement('div');
                newCardsBoxElement.className = 'save-change';
                newCardsBoxElement.innerHTML = `
                    <button class='btn-save-change' type='button'>
                        <Image priority src="/Icons/tick-square.svg" alt='tick-square' height={24} width={24} />
                        Save Changes
                    </button>
                `;
                designNavbarElement.insertAdjacentElement('afterbegin', newCardsBoxElement);
                newCardsBoxElement.querySelector('.btn-save-change')?.addEventListener('click', () => {
                    document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                });
            }
        };
        addSaveChanges();
    }, []);

    return (
        <Fragment>
            <Box component="form" onSubmit={handleSaveChanges} noValidate sx={{ overflowY: 'scroll', height: `${height - 240}px` }} display='flex' flexDirection="column" className='scrollable-div'>
                <FormControl fullWidth>
                    <TextField
                        value={formState.label}
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
                        value={formState.type}
                        name="type"
                        label="Type"
                        onChange={handleChange}
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: '50px',
                            border: '2px solid var(--Indigo, #133266)',
                            width: '160px',
                            mt: 3,
                            '& .MuiSelect-select': {
                                padding: '10px 14px',
                                width: '50%'
                            },
                        }}
                        IconComponent={() => (
                            <Image priority src={downCircle} alt="downCircle" width={25} height={25} />
                        )}
                    >
                        {['Verb', 'Noun', 'Adjective', 'Adverb'].map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
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
                        value={formState.description}
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
                        value={formState.example}
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
                        value={formState.cardBox}
                        name="cardBox"
                        label="Age"
                        onChange={handleChange}
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
                            <Image priority src={downCircle} alt="downCircle" width={25} height={25} />
                        )}
                    >
                        {cardsBox.map((item) => (
                            <MenuItem key={item.id} value={item.label}>{item.label}</MenuItem>
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
        </Fragment>
    )
}

export default EditWordsPage;

