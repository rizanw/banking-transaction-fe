"use client";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import PageContainer from "@/components/containers/PageContainer";
import {Box, Grid} from "@mui/material";
import TransactionOverview from "@/components/widgets/TransactionOverview";
import TransactionTable, {TransactionData} from "@/components/widgets/TransactionTable";
import {fetchData} from "@/utils/api/apiService";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export default function Home() {
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [totalTrasnactionData, setTotalTrasnactionData] = useState<number>(0);
    const filterStatus = session?.user!.role == 2 ? 1 : 0

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        setPageNum(page);
    };

    const loadData = async (page: number, perPage: number) => {
        setLoading(true);
        try {
            fetchData(`/transactions?page=${page}&per_page=${perPage}&status=${filterStatus}`, true).then(
                response => {
                    setTransactionData(response.data)
                    setTotalTrasnactionData(response.total);
                }
            )
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadData(pageNum + 1, rowsPerPage)
    }, [pageNum, rowsPerPage, filterStatus]);

    return (
        <ProtectedRoute>
            <PageContainer title="Dashboard" description="this is Dashboard">
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={8}>
                            <TransactionOverview/>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <TransactionTable data={transactionData} totalData={totalTrasnactionData} page={pageNum}
                                              perPage={rowsPerPage} onPageChange={handleChangePage} loading={loading}/>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>
        </ProtectedRoute>
    );
}
