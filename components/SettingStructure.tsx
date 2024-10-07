import React, { Fragment, useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

// import MUI
import { Grid, Button } from "@mui/material";

// import SVG
import profile from '../public/Icons/profile.svg';
import setting from '../public/Icons/setting.svg';
import logout from '../public/Icons/logout.svg';
import info from '../public/Icons/info.svg';

// import axios
import axiosInstance from "@/helper/axiosInstance";

const SettingStructure = () => {

    const route = useRouter();

    const [height, setHeight] = useState<number>(0);
    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogOut = () => {
        axiosInstance.post('/users/logout').then((res) => {
            if (res.status === 200) {
                deleteCookie('accessToken');
                deleteCookie('refreshToken');
                route.push('/');
            } else if (res.status = 404) {
                alert('User not found!');
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <Fragment>
            <div style={{ height: `${height - 200}px` }} className='scrollable-div'>
                <Link href='#' className="account-style d-felx mt-5 flex-row align-items-center justify-content-center">
                    <Image priority src={profile} width={24} height={24} alt="profile" />
                    <span className="ms-2">Account</span>
                </Link>
                <Link href='#' className="preferences-style mt-5 d-felx flex-row align-items-center justify-content-center">
                    <Image priority src={setting} width={24} height={24} alt="setting" />
                    <span className="ms-2">Preferences</span>
                </Link>

                <Grid container spacing={1} display='flex' alignItems='center' justifyContent='space-between' flexDirection='row'>
                    <Grid item xs={6}>
                        <Button onClick={handleLogOut} className="logout-style mt-5 d-felx flex-row align-items-center justify-content-center">
                            <Image priority src={logout} width={24} height={24} alt="logout" />
                            <span className="ms-2">LogOut</span>
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Link href='#' className="info-style mt-5 d-felx flex-row align-items-center justify-content-center">
                            <Image priority src={info} width={24} height={24} alt="info" />
                            <span className="ms-2">Info</span>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    )
}

export default SettingStructure;