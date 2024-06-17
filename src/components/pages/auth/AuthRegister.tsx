import React, {useState} from 'react';
import {Box, Typography, Button, MenuItem} from '@mui/material';
import CustomTextField from '../../forms/CustomTextField';
import {Stack} from '@mui/system';
import {MuiTelInput} from "mui-tel-input";
import Select, {SelectChangeEvent} from '@mui/material/Select';

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({title, subtitle, subtext}: registerType) => {
    const [phoneField, setPhoneField] = useState("");
    const [roleField, setRoleField] = useState("");

    const handlePhoneChange = (value: any) => {
        setPhoneField(value);
    };

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRoleField(event.target.value);
    }

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                                fontWeight={600} component="label" htmlFor='corp-num' mb="5px">
                        Corporate Account No.
                    </Typography>
                    <CustomTextField id="corp-num" variant="outlined" fullWidth/>

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