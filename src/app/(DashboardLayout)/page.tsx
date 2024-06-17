"use client";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import PageContainer from "@/components/containers/PageContainer";
import {Box, Grid} from "@mui/material";
import TransactionOverview from "@/components/widgets/TransactionOverview";
import TransactionTable from "@/components/widgets/TransactionTable";

export default function Home() {
    return (
        <ProtectedRoute>
            <PageContainer title="Dashboard" description="this is Dashboard">
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <TransactionOverview/>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <TransactionTable/>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                </Grid>
                                <Grid item xs={12}>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>
        </ProtectedRoute>
    );
}
