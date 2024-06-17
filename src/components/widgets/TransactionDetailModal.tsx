import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
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
                <Grid container spacing={2} mb={"12px"}>
                    <Grid item xs={6}>
                        <DialogContentText>
                            From Account No.: <b>{transactionData?.from_account_num}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Maker: <b>{transactionData?.maker}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Submit Date&Time: <b>{transactionData?.submit_datetime}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Reference No.: <b>{transactionData?.ref_num}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Transfer Date: <b>{transactionData?.transfer_date}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Instruction Type: <b>{transactionData?.instruction_type}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Total Transfer Record: <b>{transactionData?.total_record}</b>
                        </DialogContentText>
                    </Grid>
                    <Grid item xs={6}>
                        <DialogContentText>
                            Total Transfer Amount: <b>{transactionData?.total_amount}</b>
                        </DialogContentText>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Account Number</TableCell>
                                <TableCell>Account Name</TableCell>
                                <TableCell>Bank</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionData?.data ? (transactionData?.data.map((transaction, idx) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{transaction.to_account_num}</TableCell>
                                    <TableCell>{transaction.to_account_name}</TableCell>
                                    <TableCell>{transaction.to_account_bank}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>{transaction.status}</TableCell>
                                </TableRow>
                            ))) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No Data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={pageNum}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[rowsPerPage]}
                />
            </DialogContent>
        </Dialog>
    )
}

export default TransactionDetailModal;