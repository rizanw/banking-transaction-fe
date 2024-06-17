import React, {useEffect, useState} from 'react';
import {Box, Typography, Button, MenuItem, Alert} from '@mui/material';
import CustomTextField from '../../forms/CustomTextField';
import {Stack} from '@mui/system';
import {MuiTelInput} from "mui-tel-input";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import CheckIcon from "@mui/icons-material/Check";
import {isError} from "node:util";

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
    isError?: boolean;
    message?: string;
}

const AuthRegister = ({title, subtitle, subtext, isError, message}: registerType) => {
    const [phoneField, setPhoneField] = useState("");
    const [roleField, setRoleField] = useState("");
    const [corpData, setCorpData] = useState([])
    const [corpField, setCorpField] = useState("");

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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/corporates`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCorpData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
                        <Select id="corp-num" name="corp-num" onChange={handleCorpChange} value={corpField}>
                            {corpData.map(item => (
                                    <MenuItem value={item.account_num}>
                                        {item.account_num} ({item.name})
                                    </MenuItem>
                                )
                            )}
                        </Select>

                        <Typography variant="subtitle1"
                                    fontWeight={600} component="label" htmlFor='username' mb="5px" mt="25px">
                            User Name
                        </Typography>
                        <CustomTextField id="username" type="text" name="username" variant="outlined" fullWidth/>

                        <Typography variant="subtitle1"
                                    fontWeight={600} component="label" htmlFor='role' mb="5px" mt="25px">
                            Role
                        </Typography>
                        <Select id="role" name="role" onChange={handleRoleChange} value={roleField}>
                            <MenuItem value={1}>Maker</MenuItem>
                            <MenuItem value={2}>Approver</MenuItem>
                        </Select>

                        <Typography variant="subtitle1"
                                    fontWeight={600} component="label" htmlFor='phone' mb="5px" mt="25px">
                            Phone No.
                        </Typography>
                        <MuiTelInput id="phone" name="phone" value={phoneField} onChange={handlePhoneChange}
                                     defaultCountry="ID"
                                     variant="outlined"/>

                        <Typography variant="subtitle1"
                                    fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">
                            Email
                        </Typography>
                        <CustomTextField id="email" type="email" name="email" variant="outlined" fullWidth/>

                        <Typography variant="subtitle1"
                                    fontWeight={600} component="label" htmlFor='password' mb="5px"
                                    mt="25px">Password</Typography>
                        <CustomTextField id="password" type="password" name="password" variant="outlined" fullWidth/>
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