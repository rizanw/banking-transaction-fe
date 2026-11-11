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
    <Box sx={{minWidth: 160}}>
        <CardContent>
            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h5" component="div" color={color}>
                {num ?? "-"}
            </Typography>
        </CardContent>
    </Box>
)

// shape returned by GET /transactions/stats
interface transactionStats {
    AwaitingApproval: number;
    StatusApproved: number;
    StatusRejected: number;
}

const TransactionOverview = ({refreshKey = 0}: { refreshKey?: number }) => {
    const [stats, setStats] = useState<transactionStats | null>(null);

    useEffect(() => {
        fetchData(`/transactions/stats`, true)
            .then(setStats)
            .catch(error => console.error('Fetch error:', error));
    }, [refreshKey]);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h4" mb={2}>
                    Transaction Overview
                </Typography>
                <Stack direction={{xs: "column", sm: "row"}} spacing={2} justifyContent="center" alignItems="center">
                    <Card variant="outlined">
                        <CardItem title="Awaiting Approval" num={stats?.AwaitingApproval} color="warning.main"/>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title="Approved" num={stats?.StatusApproved} color="success.main"/>
                    </Card>
                    <Card variant="outlined">
                        <CardItem title="Rejected" num={stats?.StatusRejected} color="error.main"/>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TransactionOverview;
