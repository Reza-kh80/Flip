import NextAuth, { NextAuthOptions, User, Session, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';

// Extend the built-in session type
declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpiry?: number;
        refreshTokenExpiry?: number;
        error?: string;
    }
}

interface CustomUser extends User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
}

interface TokenUser {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
}

interface CustomToken extends JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    refreshTokenExpiry: number;
    error?: string;
}

const refreshToken = async (token: CustomToken): Promise<CustomToken> => {
    try {
        const response = await axios.post('http://localhost:8000/api/users/refresh-token', {
            refreshToken: token.refreshToken,
        });

        return {
            ...token,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            accessTokenExpiry: Date.now() + 900 * 1000, // 30 seconds
            refreshTokenExpiry: Date.now() + 1200 * 1000, // 60 seconds
        };
    } catch (error) {
        console.error('Error refreshing token:', error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        } as CustomToken;
    }
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<TokenUser | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const response = await axios.post('http://localhost:8000/api/users/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (response.data) {
                        return {
                            id: response.data.userId,
                            email: credentials.email,
                            accessToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                            accessTokenExpiry: Date.now() + 900 * 1000, // 30 seconds
                            refreshTokenExpiry: Date.now() + 1200 * 1000, // 60 seconds
                        };
                    }
                    return null;
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || 'Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }): Promise<CustomToken> {
            if (user) {
                // First time jwt callback is run, user object is available
                return {
                    ...token,
                    accessToken: (user as CustomUser).accessToken,
                    refreshToken: (user as CustomUser).refreshToken,
                    accessTokenExpiry: (user as CustomUser).accessTokenExpiry,
                    refreshTokenExpiry: (user as CustomUser).refreshTokenExpiry,
                } as CustomToken;
            }

            const customToken = token as CustomToken;

            // Check if refresh token has expired
            if (Date.now() > customToken.refreshTokenExpiry) {
                return {
                    ...customToken,
                    error: "RefreshTokenExpired"
                };
            }

            // If access token has not expired, return token
            if (Date.now() < customToken.accessTokenExpiry) {
                return customToken;
            }

            // If access token has expired, try to refresh it
            return refreshToken(customToken);
        },

        async session({ session, token }): Promise<Session> {
            const customToken = token as CustomToken;

            if (customToken.error) {
                return {} as Session;
            }

            return {
                ...session,
                accessToken: customToken.accessToken,
                refreshToken: customToken.refreshToken,
                accessTokenExpiry: customToken.accessTokenExpiry,
                refreshTokenExpiry: customToken.refreshTokenExpiry,
                error: customToken.error,
            };
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 1200, // 60 seconds - match with refresh token expiry
    },
    events: {
        async signOut(message) {
            // You can add any cleanup logic here
            console.log('User signed out:', message);
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
};

export default NextAuth(authOptions);