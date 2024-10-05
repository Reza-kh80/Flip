import { useEffect, useCallback } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from "next/app";
import Head from "next/head";
import axiosInstance from "@/helper/axiosInstance";

// import Context
import { CheckProvider } from "@/context/Exceptional";

export default function App({ Component, pageProps }: AppProps) {

  const { push } = useRouter();

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/users/refresh-token');
      setCookie('token', response.data.token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ('status' in error && typeof error.status === 'number') {
          if (error.status === 401) {
            console.log('Token expired');
            deleteCookie('token');
            push('/');
          } else if (error.status === 500) {
            console.log('Failed to refresh token:', error);
            deleteCookie('token');
            push('/');
          }
        }
      }
    }
  }, []);

  useEffect(() => {

    if (!getCookie('token')) {
      console.log('No token found');
    } else {

      const intervalId = setInterval(refreshToken, 1 * 10 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [refreshToken, push]);

  return (
    <CheckProvider>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content="Best PWA app in the world!" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/Images/Flipit-Logo-WB.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/Images/Flipit-Logo-WB.svg" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/Images/Flipit-Logo-WB.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/Images/Flipit-Logo-WB.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="My awesome PWA app" />
        <meta name="twitter:description" content="Best PWA app in the world!" />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="My awesome PWA app" />
        <meta property="og:description" content="Best PWA app in the world!" />
        <meta property="og:site_name" content="My awesome PWA app" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/icons/og.png" />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
      </Head>
      <Component {...pageProps} />
    </CheckProvider>
  )
}
