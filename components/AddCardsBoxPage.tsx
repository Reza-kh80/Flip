import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { TextField, Box, Grid, Button } from '@mui/material';
import axiosInstance from '@/helper/axiosInstance';

const NewCardStyle = {
    width: '275px',
    height: '275px',
    border: '3px solid #133266',
    borderBottom: '6px solid #133266',
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#ffffff",
    borderRadius: "15px",
    p: 2,
};

const AddCardsBoxPage = () => {
    const { push } = useRouter();
    const [topic, setTopic] = useState('');
    const [topicError, setTopicError] = useState('');
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAddNewCard = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const sanitizedTopic = topic.trim();
        setTopicError(sanitizedTopic ? '' : 'Name is required!');
        if (sanitizedTopic) {
            axiosInstance.post('/boxes/create', { name: sanitizedTopic })
                .then((res) => {
                    if (res.status === 201) {
                        push('/flip');
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        setTopicError('This box name already exists. Please choose a different name.');
                    } else {
                        console.error('An error occurred:', error);
                        setTopicError('An error occurred. Please try again.');
                    }
                });
        }
    }, [topic]);

    const backToHomePage = useCallback(() => push('/flip'), [push]);

    return (
        <div style={{ height: `${height - 100}px` }}>
            <Box component="form" onSubmit={handleAddNewCard} noValidate sx={NewCardStyle} display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
                <TextField
                    value={topic}
                    id="topic"
                    placeholder="Enter The name..."
                    multiline
                    margin="normal"
                    fullWidth
                    name="topic"
                    autoFocus
                    autoComplete="topic"
                    variant="outlined"
                    onChange={(e) => setTopic(e.target.value)}
                    error={!!topicError}
                    helperText={topicError}
                    InputProps={{
                        sx: {
                            backgroundColor: '#f9f9f9',
                            borderRadius: '20px',
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            fontSize: '12pt'
                        },
                    }}
                    sx={{ border: 'none', "& fieldset": { border: '3px solid #133266', borderRadius: '20px' } }}
                />
                <Grid container className="mt-3">
                    <Grid item xs={6} textAlign="center">
                        <Button
                            type="button"
                            variant="contained"
                            className="discard-style"
                            onClick={backToHomePage}
                        >
                            Discard
                        </Button>
                    </Grid>
                    <Grid item xs={6} textAlign="center">
                        <Button
                            type="submit"
                            variant="contained"
                            className="save-style"
                        // onClick={handleSaveChanges}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default AddCardsBoxPage;
