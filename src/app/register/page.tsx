"use client";
import {Grid, Box, Card, Typography, Stack} from "@mui/material";
import Link from "next/link";
import PageContainer from "@/components/containers/PageContainer";
import AuthRegister from "@/components/pages/auth/AuthRegister";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect} from "react";
import {useSession} from "next-auth/react";
import LoadingPage from "@/components/pages/LoadingPage";

const Register = () => {
    const router = useRouter();
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
        const phone = formData.get('phone')
        const email = formData.get('email')
        const role = formData.get('role')

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        })

        console.log(response, username, password, email, phone, role)
        // if (response.ok) {
        //     router.push('/login')
        // } else {
        //     console.log(response)
        // }
    }

    if (status === "loading") {
        return <LoadingPage/>;
    }

    return (
        <PageContainer title="Register" description="this is Register page">
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
                            <Box display="flex" alignItems="center" justifyContent="center">
                            </Box>
                            <form onSubmit={handleSubmit}>
                                <AuthRegister
                                    subtext={
                                        <Typography
                                            variant="subtitle1"
                                            textAlign="center"
                                            color="textSecondary"
                                            mb={1}
                                        >
                                            Register Banking-Transaction
                                        </Typography>
                                    }
                                    subtitle={
                                        <Stack
                                            direction="row"
                                            justifyContent="center"
                                            spacing={1}
                                            mt={3}
                                        >
                                            <Typography
                                                color="textSecondary"
                                                variant="h6"
                                                fontWeight="400"
                                            >
                                                Already have an Account?
                                            </Typography>
                                            <Typography
                                                component={Link}
                                                href="/login"
                                                fontWeight="500"
                                                sx={{
                                                    textDecoration: "none",
                                                    color: "primary.main",
                                                }}
                                            >
                                                Login
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

export default Register;