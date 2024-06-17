import React from 'react';
import {Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button} from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

interface ItemType {
    toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {
    const AppBarStyled = styled(AppBar)(({theme}) => ({
        boxShadow: 'none',
        background: theme.palette.background.paper,
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        [theme.breakpoints.up('lg')]: {
            minHeight: '70px',
        },
    }));
    const ToolbarStyled = styled(Toolbar)(({theme}) => ({
        width: '100%',
        color: theme.palette.text.secondary,
    }));

    return (
        <AppBarStyled position="sticky" color="default">
            <ToolbarStyled>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileSidebar}
                    sx={{
                        display: {
                            lg: "none",
                            xs: "inline",
                        },
                    }}
                >
                    <MenuIcon width="20" height="20"/>
                </IconButton>

                <Box flexGrow={1}/>
                <Stack spacing={1} direction="row" alignItems="center">
                    <Button variant="contained" component={Link} href="/authentication/login" disableElevation
                            color="primary">
                        Login
                    </Button>
                </Stack>
            </ToolbarStyled>
        </AppBarStyled>
    );
};

Header.propTypes = {
    sx: PropTypes.object,
};

export default Header;