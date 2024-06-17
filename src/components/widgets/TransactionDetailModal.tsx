import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
import {useSession} from "next-auth/react";
import LoadingPage from "@/components/pages/LoadingPage";

interface TransactionDetailDataData {
    id: number;
    to_account_num: string;
    to_account_name: string;
    to_account_bank: string;
    amount: number;
    status: string;
}

interface TransactionDetailData {
    id: number;
    ref_num: string;
    from_account_num: string,
    submit_datetime: string,
    transfer_date: string,
    instruction_type: string,
    maker: string
    total_amount: number;
    total_record: number;
    data: TransactionDetailDataData[]
    total: number
    page: number
    per_page: number
}

interface TransactionDetailModalProps {
    transactionID: number;
    open: boolean;
    onClose: () => void;
}

const TransactionDetailModal = ({transactionID, open, onClose}: TransactionDetailModalProps) => {
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(true);
    const [transactionData, setTransactionData] = useState<TransactionDetailData>();
    const [pageNum, setPageNum] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const loadData = async (transactionID: number, page: number, perPage: number) => {
        setLoading(true);
        try {
            const token = session?.accessToken;
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${transactionID}?page=${page}&per_page=${perPage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    setTransactionData(data);
                    setTotal(data.total);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(transactionID, pageNum + 1, rowsPerPage);
    }, [transactionID, pageNum, rowsPerPage]);

    // TODO: add table
    const handleChangePage = (event: unknown, newPage: number) => {
        setPageNum(newPage);
    };

    if (loading) {
        return (<LoadingPage/>)
    }

    return (
        <Dialog
            fullWidth={true}
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Transaction Detail</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DialogContentText>
                            From Account No.: {transactionData?.from_account_num}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Maker: {transactionData?.maker}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Submit Date&Time: {transactionData?.submit_datetime}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Reference No.: {transactionData?.ref_num}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Transfer Date: {transactionData?.transfer_date}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Instruction Type: {transactionData?.instruction_type}
                        </DialogContentText>
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Total Transfer Record: {transactionData?.total_record}
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Total Transfer Amount: {transactionData?.total_amount}
                        </DialogContentText>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default TransactionDetailModal;