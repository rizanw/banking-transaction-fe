import {Box, Card, CardContent, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Stack} from "@mui/system";
import {fetchData} from "@/utils/api/apiService";


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

interface transactionStats {
    awaiting_approval: number;
    approved: number;
    rejected: number
}

const TransactionOverview = () => {
    const [stats, setStats] = useState<transactionStats | null>(null);

    const loadData = async () => {
        try {
            fetchData(`/transactions/stats`, true).then(
                response => {
                    setStats(response)
                }
            )
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h4" mb={2}>
                    Transaction Overview
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Card variant="outlined">
                        <CardItem title={"Awaiting Approval"} num={stats?.awaiting_approval} color="primary"></CardItem>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title={"Successfully"} num={stats?.approved} color="info"></CardItem>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title={"Rejected"} num={stats?.rejected} color="error"></CardItem>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TransactionOverview;
