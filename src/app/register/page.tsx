"use client";
import {Grid, Box, Card, Typography, Stack, Alert} from "@mui/material";
import Link from "next/link";
import PageContainer from "@/components/containers/PageContainer";
import AuthRegister from "@/components/pages/auth/AuthRegister";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import LoadingPage from "@/components/pages/LoadingPage";
import {postData} from "@/utils/api/apiService";

const Register = () => {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [isError, setError] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");

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
        const phoneField = formData.get('phone')
        const email = formData.get('email')
        const role = formData.get('role')
        const corpnum = formData.get('corp-num')
        const code = formData.get('code')
        let phone = String(phoneField).split(" ")[0].replace(/\D/g, "") + "." + String(phoneField).split(" ").slice(1).join("")

        try {
            postData(`/register`, {
                username: username,
                password: password,
                email: email,
                phone: phone,
                role: Number(role),
                corporate_account_number: corpnum,
                code: code,
            },).then(
                response => {
                    setError(false);
                    setAlertMsg("User registered successfully! Please Login.");
                }
            ).catch((error) => {
                if (error.response) {
                    setError(true);
                    setAlertMsg(String(error.response.data))
                }
            })
        } catch (error) {
            console.error('Post error:', error);
        }
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
                                    isError={isError}
                                    message={alertMsg}
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