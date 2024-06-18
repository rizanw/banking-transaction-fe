import React from "react";
import {
    Box,
    Typography,
    Button,
    Stack, Alert
} from "@mui/material";
import CustomTextField from "../../forms/CustomTextField";

interface loginType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    errorMessage?: string;
}

const AuthLogin = ({title, subtitle, subtext, errorMessage}: loginType) => (
    <>
        {title ? (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        {
            errorMessage ? (
                <Alert variant="outlined" severity={"error"}>
                    {errorMessage}
                </Alert>
            ) : null
        }

        <Stack>
            <Box>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="username"
                    mb="5px"
                >
                    Username
                </Typography>
                <CustomTextField type="text" name="username" variant="outlined" fullWidth/>
            </Box>
            <Box mt="25px">
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    component="label"
                    htmlFor="password"
                    mb="5px"
                >
                    Password
                </Typography>
                <CustomTextField type="password" name="password" variant="outlined" fullWidth/>
            </Box>
            <Stack
                justifyContent="space-between"
                direction="row"
                alignItems="center"
                my={2}
            >
            </Stack>
        </Stack>
        <Box>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
            >
                Login
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthLogin;