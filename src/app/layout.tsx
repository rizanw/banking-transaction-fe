"use client";
import {SessionProvider} from "next-auth/react";
import {baselightTheme} from "@/utils/theme/DefaultColors";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./globals.css";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";

interface Props {
    children: React.ReactNode;
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
        <ThemeProvider theme={baselightTheme}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </LocalizationProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
