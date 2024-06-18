"use client";
import Link from "next/link";
import {Grid, Box, Card, Stack, Typography} from "@mui/material";
import PageContainer from "@/components/containers/PageContainer";
import AuthLogin from "@/components/pages/auth/AuthLogin";
import {FormEvent, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {signIn, useSession} from "next-auth/react";
import LoadingPage from "@/components/pages/LoadingPage";

const Login = () => {
    const router = useRouter()
    const [error, setError] = useState("");
    const {data: session, status} = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = formData.get('username')
        const password = formData.get('password')

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password
            })
            console.log("login:", result)
            if (result?.error) {
                setError(result?.error);
            }
        } catch (error) {
            setError(String(error));
        }
    }

    if (status === "loading") {
        return <LoadingPage/>;
    }

    return (
        <PageContainer title="Login" description="Login page for banking-transaction app">
            <Box
                sx={{
                    position: "relative",
                    "&:before": {
                        content: '""',
                        background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                        backgroundSize: "400% 400%",
                        animation: "gradient 15s ease infinite",
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        opacity: "0.3",
                    },
                }}
            >
                <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    sx={{height: "100vh"}}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        xl={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card
                            elevation={9}
                            sx={{p: 4, zIndex: 1, width: "100%", maxWidth: "500px"}}
                        >
                            <form onSubmit={handleSubmit}>
                                <AuthLogin
                                    errorMessage={error}
                                    subtext={
                                        <Typography
                                            variant="subtitle1"
                                            textAlign="center"
                                            color="textSecondary"
                                            mb={1}
                                        >
                                            Login Banking-Transaction
                                        </Typography>
                                    }
                                    subtitle={
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                            mt={3}
                                        >
                                            <Typography
                                                component={Link}
                                                href="/register"
                                                fontWeight="500"
                                                sx={{
                                                    textDecoration: "none",
                                                    color: "primary.main",
                                                }}
                                            >
                                                Create an account
                                            </Typography>
                                        </Stack>
                                    }
                                />
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};
export default Login;