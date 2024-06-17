import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            authorize: async (credentials) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password
                        })
                    });

                    const data = await res.json();
                    if (res.ok && data.access_token) {
                        return {
                            id: data.user_info.user_id,
                            name: data.user_info.username,
                            email: data.user_info.email,
                            role: data.user_info.role,
                            accessToken: data.access_token,
                            corporateInfo: data.corporate_info
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error during authentication", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    session: {
        jwt: true
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.accessToken;
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    corporateInfo: user.corporateInfo
                };
            }
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
