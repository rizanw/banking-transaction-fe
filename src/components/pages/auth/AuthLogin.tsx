import React from "react";
import {
    Box,
    Typography,
    Button,
    Stack, Alert, InputAdornment, IconButton
} from "@mui/material";
import CustomTextField from "../../forms/CustomTextField";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface loginType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    errorMessage?: string;
}

const AuthLogin = ({title, subtitle, subtext, errorMessage}: loginType) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
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
                    <CustomTextField required type="text" name="username" variant="outlined" fullWidth/>
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
                    <CustomTextField required name="password" variant="outlined" fullWidth
                                     type={showPassword ? 'text' : 'password'}
                                     InputProps={{
                                         endAdornment:
                                             <InputAdornment position="end">
                                                 <IconButton
                                                     aria-label="toggle password visibility"
                                                     onClick={handleClickShowPassword}
                                                     onMouseDown={handleMouseDownPassword}
                                                     edge="end"
                                                 >
                                                     {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                 </IconButton>
                                             </InputAdornment>,
                                     }}
                    />
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
    )
};

export default AuthLogin;