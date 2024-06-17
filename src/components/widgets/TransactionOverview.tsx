import {Box, Card, CardContent, Typography} from "@mui/material";
import React from "react";
import {Stack} from "@mui/system";


type cardProps = {
    title?: string;
    num?: number;
    color?: string;
};

const CardItem = ({title, num, color}: cardProps) => (
    <React.Fragment>
        <Box sx={{minWidth: 200}}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div" color={color}>
                    {num}
                </Typography>
            </CardContent>
        </Box>
    </React.Fragment>
)

const TransactionOverview = () => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h4" mb={2}>
                    Transaction Overview
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Card variant="outlined">
                        <CardItem title={"Awaiting Approval"} num={0} color="primary"></CardItem>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title={"Successfully"} num={0} color="info"></CardItem>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title={"Rejected"} num={0} color="error"></CardItem>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TransactionOverview;
