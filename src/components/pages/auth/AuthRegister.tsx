import React, {FormEvent, useEffect, useState} from 'react';
import {Box, Typography, Button, MenuItem, Alert, InputAdornment, IconButton} from '@mui/material';
import CustomTextField from '../../forms/CustomTextField';
import {Stack} from '@mui/system';
import {MuiTelInput} from "mui-tel-input";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {fetchData, postData} from "@/utils/api/apiService";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    isError?: boolean;
    message?: string;
}

interface corporation {
    id: number;
    account_num: string;
    name: string;
}

const AuthRegister = ({title, subtitle, subtext, isError, message}: registerType) => {
    const [emailField, setEmailField] = useState("");
    const [phoneField, setPhoneField] = useState("");
    const [roleField, setRoleField] = useState("");
    const [corpData, setCorpData] = useState<corporation[]>([])
    const [corpField, setCorpField] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isCodeSend, setIsCodeSend] = React.useState(false);
    const [count, setCount] = useState<number>(0);

    const handleClickSendCode = async (event: FormEvent<HTMLFormElement>) => {
        if (emailField == "") {
            message = "please fill your email first!"
            return
        }
        try {
            postData(`/send-otp`, {email: emailField}).then(
                response => {
                    console.log(response)
                    message = response.message;
                    setIsCodeSend(true);
                    setCount(60)
                }
            )
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handlePhoneChange = (value: any) => {
        setPhoneField(value);
    };

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRoleField(event.target.value);
    }

    const handleCorpChange = (event: SelectChangeEvent) => {
        setCorpField(event.target.value);
    }

    useEffect(() => {
        try {
            fetchData(`/corporates`).then(
                response => {
                    setCorpData(response);
                }
            )
        } catch (error) {
            console.error('Fetch error:', error);
        }

        if (count > 0) {
            const timer = setInterval(() => {
                setCount(prevCount => prevCount - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [count]);

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            {
                message ? (
                    <Alert variant="outlined" severity={isError ? "error" : "success"}>
                        {message}
                    </Alert>
                ) : null
            }

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='corp-num' mb="5px">
                        Corporate Account No.
                    </Typography>
                    <Select required id="corp-num" name="corp-num" onChange={handleCorpChange} value={corpField}>
                        {corpData.map((item: corporation) => (
                                <MenuItem key={item.id} value={item.account_num}>
                                    {item.account_num} ({item.name})
                                </MenuItem>
                            )
                        )}
                    </Select>

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='username' mb="5px" mt="25px">
                        User Name
                    </Typography>
                    <CustomTextField required id="username" type="text" name="username" variant="outlined"
                                     fullWidth/>

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='role' mb="5px" mt="25px">
                        Role
                    </Typography>
                    <Select required id="role" name="role" onChange={handleRoleChange} value={roleField}>
                        <MenuItem value={1}>Maker</MenuItem>
                        <MenuItem value={2}>Approver</MenuItem>
                    </Select>

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='phone' mb="5px" mt="25px">
                        Phone No.
                    </Typography>
                    <MuiTelInput required id="phone" name="phone" value={phoneField} onChange={handlePhoneChange}
                                 defaultCountry="ID"
                                 variant="outlined"/>

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">
                        Email
                    </Typography>
                    <CustomTextField required id="email" type="email" name="email" variant="outlined" fullWidth
                                     value={emailField} onChange={(e) => setEmailField(e.currentTarget.value)}/>

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='password' mb="5px"
                                mt="25px">Password</Typography>
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

                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='code' mb="5px"
                                mt="25px">Verification Code</Typography>
                    <CustomTextField required name="code" variant="outlined" fullWidth type="text"
                                     helperText={count ? "we send the code on your email. please try again in " + count : ""}
                                     InputProps={{
                                         endAdornment:
                                             <InputAdornment position="end">
                                                 <Button
                                                     disabled={isCodeSend}
                                                     color="primary"
                                                     variant="contained"
                                                     onClick={handleClickSendCode}
                                                     edge="end"
                                                 >
                                                     Send OTP
                                                 </Button>
                                             </InputAdornment>,
                                     }}
                    />
                </Stack>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                >
                    Register
                </Button>
            </Box>
            {subtitle}
        </>
    )
};

export default AuthRegister;