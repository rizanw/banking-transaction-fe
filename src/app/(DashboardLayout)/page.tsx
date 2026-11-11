"use client";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import PageContainer from "@/components/containers/PageContainer";
import {Box, Grid} from "@mui/material";
import TransactionOverview from "@/components/widgets/TransactionOverview";
import TransactionTable, {TransactionData} from "@/components/widgets/TransactionTable";
import {fetchData} from "@/utils/api/apiService";
import React, {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {ROLE_APPROVER} from "@/utils/roles";

export default function Home() {
    const {data: session} = useSession();
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const rowsPerPage = 5;
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [totalTransactionData, setTotalTransactionData] = useState<number>(0);
    const [refreshKey, setRefreshKey] = useState(0);

    // approvers see what's waiting for them; makers see their latest transactions
    const filterStatus = session?.user?.role === ROLE_APPROVER ? 1 : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        setPageNum(page);
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchData(`/transactions`, true, {
                params: {page: pageNum + 1, per_page: rowsPerPage, status: filterStatus},
            });
            setTransactionData(response.data);
            setTotalTransactionData(response.total);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [pageNum, filterStatus]);

    useEffect(() => {
        if (session) loadData();
    }, [session, loadData]);

    return (
        <ProtectedRoute>
            <PageContainer title="Dashboard" description="Transaction overview">
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TransactionOverview refreshKey={refreshKey}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TransactionTable data={transactionData} totalData={totalTransactionData} page={pageNum}
                                              perPage={rowsPerPage} onPageChange={handleChangePage} loading={loading}
                                              onAudited={() => {
                                                  loadData();
                                                  setRefreshKey(k => k + 1);
                                              }}/>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>
        </ProtectedRoute>
    );
}
