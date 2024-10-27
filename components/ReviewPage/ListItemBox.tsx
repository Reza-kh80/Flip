import React, { useRef, useEffect, Fragment } from 'react';
import Image from 'next/image';

// import MUI
import { Button } from '@mui/material';

// import SVG
import deleteIcon from '@/public/Icons/delete.svg';
import editIcon from '@/public/Icons/edit.svg';

interface ListItemProps {
    label: string,
    type: string,
    description: string,
    example: string,
    id: string | number;
    index: number;
    onEditAction: (id: string | number, label: string, type: string) => void;
    onDeleteAction: (id: string | number) => void;
}

interface UseSwipeOptions {
    completedThreshold?: number;
}

const ListItemBox = ({ id, index, label, type, description, example, onDeleteAction, onEditAction }: ListItemProps) => {

    const useSwipe = (
        { completedThreshold = 50 }: UseSwipeOptions = {}
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
            if (diff > 0) {
                ref.current.style.transform = `translateX(${diff}px)`;
                isSwipeComplete.current = Math.abs(diff) >= completedThreshold;
            }

        };

        const resetHandler = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mousemove', handleMouseMove);

            if (isSwipeComplete.current) {
                isSwipeComplete.current = false;
                scrollOutOfView(currentX.current < 0);
            } else {
                if (!ref.current) return;
                ref.current.style.transition = "transform 150ms ease-out";
                ref.current.style.transform = "translateX(0)";
            }

            startX.current = null;
            currentX.current = 0;
            isDragging.current = false;
        };

        const scrollOutOfView = (isLeft: boolean) => {
            const TRANSITION_TIME = 300;

            if (ref.current) {
                ref.current.style.transition = `transform ${TRANSITION_TIME}ms ease-out`;
                ref.current.style.transform = `translateX(${200}px)`;
            }
        };

        return { ref };
    };

    const { ref } = useSwipe();

    return (
        <Fragment>
            <div className="list-item" style={index !== 0 ? { margin: '40px 0' } : { marginTop: '0' }} /*onClick={() => goToReviewPage(label)}*/>
                <div className='card-global-page-review mt-4' ref={ref}>
                    <div className='d-flex fex-row align-items-center'>
                        <h3 className='me-3 fw-bold'>{label}</h3>
                        <span className='border-type'>{type}</span>
                    </div>
                    <div className='mt-3'>
                        {description}
                    </div>
                    <div className='mt-3'>
                        {example}
                    </div>
                </div>
                <div className="list-item__option">
                    <div className='action__design' id={`action__design__${index}`}>
                        <Button
                            className='delete__btn__review me-4'
                            sx={{ "& .MuiButton-startIcon": { margin: "0px" } }}
                            startIcon={
                                <Image priority src={deleteIcon} alt="delete" width={25} height={25} />
                            }
                            onClick={() => onDeleteAction(id)}
                        >Delete</Button>
                        <Button
                            className='edit__btn__review'
                            sx={{ "& .MuiButton-startIcon": { margin: "0px" } }}
                            startIcon={
                                <Image priority src={editIcon} alt="edit" width={25} height={25} />
                            }
                            onClick={() => onEditAction(id, label, type)}
                        >Edit</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ListItemBox;
