import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {postData} from "@/utils/api/apiService";
import {throws} from "node:assert";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                try {
                    const res = await postData(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                        username: credentials?.username,
                        password: credentials?.password
                    });

                    if (res.accessToken != "") {
                        return {
                            id: res.user_info.user_id,
                            name: res.user_info.username,
                            email: res.user_info.email,
                            role: res.user_info.role,
                            accessToken: res.access_token,
                            corporateInfo: res.corporate_info
                        };
                    } else {
                        return {error: res.data.message};
                    }
                } catch (error) {
                    console.error("Error during authentication", error);
                    return {error: error.response.data.message};
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/logout"
    },
    session: {
        jwt: true
    },
    callbacks: {
        async signIn({user}) {
            if (user?.error) {
                throw new Error(user?.error)
            }
            return true
        },
        async signOut() {
            await postData(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, true);
        },
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
