import React, { useRef, useEffect, Fragment, useState } from 'react';
import { useRouter } from "next/router";

// import MUI
import { Snackbar, Button } from '@mui/material';

interface ListItemProps {
    id: string | number;
    label: string;
    index: number;
    number: number;
    onCompleteRight: (id: string | number) => void;
    onCompleteLeft: (id: string | number) => void;
}

interface UseSwipeOptions {
    completedThreshold?: number;
}

const ListItem = ({ id, label, number, index, onCompleteLeft, onCompleteRight }: ListItemProps) => {
    const { push } = useRouter();

    // states of undo
    const [undo, setUndo] = useState<boolean>(false);
    const [openUndo, setOpenUndo] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0);
    const timerRef = useRef<number | null>(null);

    const handleUndo = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        if (!ref.current) return;
        ref.current.style.transform = "translateX(0)";

        setUndo(true);
        setOpenUndo(false);
        setCounter(0);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const listItemElement = document.querySelectorAll('.card-global-page-home');
        listItemElement.forEach((items) => {
            const item = items as HTMLElement;
            item.style.pointerEvents = 'painted';
        })
    };

    const action = (
        <Fragment>
            <div className='timer-undo'>{counter}</div>
            <Button sx={{ color: '#133266', fontWeight: 'bold' }} size="small" onClick={handleUndo}>
                UNDO
            </Button>
        </Fragment>
    );

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    const useSwipe = (
        onCompleteLeft: () => void,
        onCompleteRight: () => void,
        { completedThreshold = 125 }: UseSwipeOptions = {}
    ) => {
        const ref = useRef<HTMLDivElement>(null);
        const startX = useRef<number | null>(null);
        const currentX = useRef<number>(0);
        const isSwipeComplete = useRef<boolean>(false);
        const isDragging = useRef<boolean>(false);

        useEffect(() => {
            if (ref.current) {
                ref.current.style.transition = "transform 150ms ease-out";
                ref.current.addEventListener('touchstart', handleTouchStart, { passive: false });
                ref.current.addEventListener('mousedown', handleMouseDown);
                document.addEventListener('touchend', resetHandler);
                document.addEventListener('mouseup', resetHandler);
            }

            return () => {
                if (ref.current) {
                    ref.current.removeEventListener('touchstart', handleTouchStart);
                    ref.current.removeEventListener('mousedown', handleMouseDown);
                }
                document.removeEventListener('touchend', resetHandler);
                document.removeEventListener('mouseup', resetHandler);
            };
        }, []);

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            startX.current = e.touches[0].clientX;
            isDragging.current = false;
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
        };

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            startX.current = e.clientX;
            isDragging.current = false;
            document.addEventListener('mousemove', handleMouseMove);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (startX.current === null) return;
            const touchX = e.touches[0].clientX;
            const diff = touchX - startX.current;
            isDragging.current = true;
            updateSwipePosition(diff);
        };

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            if (startX.current === null) return;
            const diff = e.clientX - startX.current;
            isDragging.current = true;
            updateSwipePosition(diff);
        };

        const updateSwipePosition = (diff: number) => {
            if (!ref.current) return;

            currentX.current = diff;
            ref.current.style.transform = `translateX(${diff}px)`;
            isSwipeComplete.current = Math.abs(diff) >= completedThreshold;

            updateDesignElements(diff);
        };

        const updateDesignElements = (diff: number) => {
            if (!ref.current || !ref.current.nextElementSibling) return;

            const nextSibling = ref.current.nextElementSibling as HTMLElement;
            const deleteDesignElement = nextSibling.children[0] as HTMLElement;
            const fastDesignElement = nextSibling.children[1] as HTMLElement;

            if (diff < 0) {
                fastDesignElement.style.display = 'none';
                deleteDesignElement.style.display = 'block';
            } else {
                deleteDesignElement.style.display = 'none';
                fastDesignElement.style.display = 'block';
            }
        };

        const resetHandler = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mousemove', handleMouseMove);

            if (isSwipeComplete.current) {
                isSwipeComplete.current = false;
                scrollOutOfView(currentX.current < 0);
            } else if (!isDragging.current && startX.current !== null) {
                push(`/review/${ref.current?.children[0].innerHTML}`)
            } else {
                if (!ref.current) return;
                ref.current.style.transition = "transform 150ms ease-out";

                const listItemElement = document.querySelectorAll('.card-global-page-home');
                listItemElement.forEach(items => {
                    if (!ref.current) return;
                    const item = items as HTMLElement;
                    if (item.style.pointerEvents !== 'none') {
                        ref.current.style.transform = "translateX(0)";
                    }
                })
            }

            startX.current = null;
            currentX.current = 0;
            isDragging.current = false;
        };

        const scrollOutOfView = (isLeft: boolean) => {
            const TRANSITION_TIME = 5000;
            const elementWidth = ref.current?.offsetWidth || 0;

            if (ref.current) {
                ref.current.style.transition = `transform ${300}ms ease-out`;
                ref.current.style.transform = `translateX(${isLeft ? -elementWidth : elementWidth}px)`;

                const listItemElement = document.querySelectorAll('.card-global-page-home');

                if (isLeft) {
                    listItemElement.forEach((items) => {
                        const item = items as HTMLElement;
                        item.style.pointerEvents = 'none';
                    })
                    setOpenUndo(true);
                    setCounter(5);
                    timerRef.current = window.setTimeout(() => {
                        if (!undo) {
                            onCompleteLeft();
                        }
                        setOpenUndo(false);
                        timerRef.current = null;
                        listItemElement.forEach((items) => {
                            const item = items as HTMLElement;
                            item.style.pointerEvents = 'painted';
                        })
                    }, TRANSITION_TIME);
                } else {
                    setOpenUndo(false);
                    setCounter(0);
                    onCompleteRight();
                }
            }
        };

        return { ref };
    };

    const { ref } = useSwipe(() => onCompleteLeft(id), () => onCompleteRight(id));

    return (
        <Fragment>
            <div className="list-item" style={index !== 0 ? { margin: '-20px 0' } : { marginTop: '0' }} /*onClick={() => goToReviewPage(label)}*/>
                <div className='card-global-page-home mt-4' ref={ref}>
                    <h3 className='fw-bold'>{label}</h3>
                    <div className='d-flex flex-row justify-content-between align-items-center mt-3'>
                        <span>{number} Cards</span>
                        <span className='border-3d'>3d</span>
                    </div>
                </div>
                <div className="list-item__option">
                    <div className='delete__design' id={`delete__design__${index}`}>Delete</div>
                    <div className='fast__design' id={`fast__design__${index}`}>Quick browsing</div>
                </div>
            </div>
            {
                openUndo ? (
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        open={openUndo}
                        autoHideDuration={5000}
                        message="Note Deleted"
                        action={action}
                        style={{ bottom: '215px' }}
                        ContentProps={{
                            sx: {
                                width: '550px',
                                backgroundColor: '#AED6CC',
                                boxShadow: '8px 10px 20px #4c4949',
                                color: '#133266',
                                fontWeight: 'bold'
                            }
                        }}
                    />
                ) : null
            }
        </Fragment>
    );
}

export default ListItem;
