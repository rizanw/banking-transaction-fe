import axios from "axios";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {errorMessage} from "@/utils/api/errors";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                try {
                    const {data} = await axios.post(`${apiURL}/login`, {
                        username: credentials?.username,
                        password: credentials?.password,
                    });

                    return {
                        id: data.user_info.id,
                        name: data.user_info.username,
                        email: data.user_info.email,
                        role: data.user_info.role,
                        accessToken: data.access_token,
                        corporateInfo: data.corporate_info,
                    };
                } catch (error) {
                    // shown on the login page through signIn()'s result.error
                    throw new Error(errorMessage(error, "Unable to reach the server, please try again"));
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // match the API token lifetime
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.accessToken;
                token.user = {
                    id: user.id,
                    name: user.name ?? "",
                    email: user.email ?? "",
                    role: user.role,
                    corporateInfo: user.corporateInfo,
                };
            }
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        },
    },
    events: {
        // revoke the API token when the user signs out
        async signOut({token}) {
            if (!token?.accessToken) return;
            try {
                await axios.post(`${apiURL}/logout`, {}, {
                    headers: {Authorization: `Bearer ${token.accessToken}`},
                });
            } catch {
                // the token may already be expired or revoked
            }
        },
    },
};
