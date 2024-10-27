import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

// import SVG
import category from '@/public/icons/category.svg';
import search from '@/public/icons/search.svg';
import filter from '@/public/icons/filter.svg';
import plus from '@/public/icons/plus.svg';

const Navbar = () => {
    const { asPath } = useRouter();
    const [currentPath, setCurrentPath] = useState<string>("");

    useEffect(() => {
        setCurrentPath(asPath);
    }, [asPath]);

    return (
        <header className='design-navbar position-fixed bottom-0'>
            <ul className='list-unstyled d-flex flex-row-reverse justify-content-around align-items-center p-4 mb-0'>
                <li>
                    <Link href='/setting' aria-label='Setting'>
                        <Image priority src={filter} alt='filter' width={32} height={32} className={currentPath === '/setting' ? "opacity-100" : "opacity-50"} />
                    </Link>
                </li>
                <li>
                    <Link href='/add-word' aria-label='Add Word'>
                        <Image priority src={plus} alt='plus' width={32} height={32} className={currentPath === '/add-word' ? "opacity-100" : "opacity-50"} />
                    </Link>
                </li>
                <li>
                    <Link href='/flip' aria-label='Flip'>
                        <Image priority src={category} alt='category' width={32} height={32} className={currentPath === '/flip' ? "opacity-100" : "opacity-50"} />
                    </Link>
                </li>
                <li>
                    <Link href='/search' aria-label='Search'>   
                        <Image priority src={search} alt="Search" width="32" height="32" className={currentPath === '/search' ? "opacity-100" : "opacity-50"} />
                    </Link>
                </li>
            </ul>
        </header>
    )
}

export default Navbar;