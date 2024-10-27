import { CreateAlertFunction } from "@/types/common";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useMemo } from 'react';
import type { AppProps } from "next/app";
import Toaster from '@/helper/Toaster';
import "@/styles/globals.css";
import Head from "next/head";

// import Context
import { CheckProvider } from "@/context/Exceptional";

// Extend AppProps to include createAlert
type CustomAppProps = AppProps & {
  Component: AppProps["Component"] & {
    createAlert?: CreateAlertFunction;
  };
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const [alertState, setAlertState] = useState<string>('');

  const createAlert = (alertType: string, destroyAfterInSeconds: number) => {
    setAlertState(alertType);
    setTimeout(() => setAlertState(''), destroyAfterInSeconds * 1000);
  }

  const alertElement = useMemo(() => (
    <Toaster
      message={alertState.split('_')[0]}
      severity={alertState.split('_')[1]}
    />
  ), [alertState]);

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

        {/* Apple Splash Screens */}
        {[
          { size: 2048, dim: '2048x2732' },
          { size: 1668, dim: '1668x2224' },
          { size: 1536, dim: '1536x2048' },
          { size: 1125, dim: '1125x2436' },
          { size: 1242, dim: '1242x2208' },
          { size: 750, dim: '750x1334' },
          { size: 640, dim: '640x1136' }
        ].map(({ size, dim }) => (
          <link
            key={size}
            rel="apple-touch-startup-image"
            href={`/images/apple_splash_${size}.png`}
            sizes={dim}
          />
        ))}
      </Head>
      {alertState.length ? alertElement : ''}
      <Component createAlert={createAlert} {...pageProps} />
    </CheckProvider>
  )
}