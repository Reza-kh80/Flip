import { useEffect, ComponentType } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface SessionMonitorResult {
    session: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
}

// Custom hook for session monitoring
export function useSessionMonitor(): SessionMonitorResult {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || status !== 'authenticated') return;

        const checkSession = (): void => {
            const refreshTokenExpiry = session.refreshTokenExpiry as number;
            const timeUntilExpiry = refreshTokenExpiry - Date.now();

            // Show warning 5 seconds before expiry
            if (timeUntilExpiry <= 5000 && timeUntilExpiry > 0) {

            }

            // Handle expired session
            if (timeUntilExpiry <= 0) {
                handleExpiredSession();
            }
        };

        const handleExpiredSession = async (): Promise<void> => {

            await signOut({ redirect: false });
            router.push('/login');
        };

        const intervalId = setInterval(checkSession, 1000);
        return () => clearInterval(intervalId);
    }, [session, status, router]);

    return { session, status };
}

// Higher-order component for protected routes
export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const { session, status } = useSessionMonitor();
        const router = useRouter();

        // Show loading state while checking session
        if (status === 'loading') {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            if (typeof window !== 'undefined') {
                router.replace('/login');
            }
            return null;
        }

        // Render component if authenticated
        return <WrappedComponent {...props} />;
    };
}

// Extend the Session type to include our custom properties
declare module "next-auth" {
    interface Session {
        refreshTokenExpiry?: number;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpiry?: number;
        error?: string;
    }
}