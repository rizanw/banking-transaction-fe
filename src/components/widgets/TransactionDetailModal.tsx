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
import LoadingPage from "@/components/pages/LoadingPage";
import {fetchData} from "@/utils/api/apiService";
import {formatAmount} from "@/utils/format";

interface TransactionDetailDataData {
    id: string;
    to_account_num: string;
    to_account_name: string;
    to_account_bank: string;
    amount: number;
    status: string;
}

interface TransactionDetailData {
    id: string;
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
    transactionID: string;
    open: boolean;
    onClose: () => void;
}

const TransactionDetailModal = ({transactionID, open, onClose}: TransactionDetailModalProps) => {
    const [loading, setLoading] = useState(true);
    const [transactionData, setTransactionData] = useState<TransactionDetailData>();
    const [pageNum, setPageNum] = useState(0);
    const rowsPerPage = 10;

    const loadData = async (transactionID: string, page: number, perPage: number) => {
        setLoading(true);
        try {
            const response = await fetchData(`/transaction/${transactionID}?page=${page}&per_page=${perPage}`, true);
            setTransactionData(response);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false)
        }
    };

    // the API returns every transfer row at once, so pagination happens here
    useEffect(() => {
        loadData(transactionID, 1, rowsPerPage);
        setPageNum(0);
    }, [transactionID, rowsPerPage]);

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
                            Total Transfer Amount: <b>{formatAmount(transactionData?.total_amount)}</b>
                        </DialogContentText>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Account No.</TableCell>
                                <TableCell>Account Name</TableCell>
                                <TableCell>Bank</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionData?.data?.length ? (transactionData.data
                                .slice(pageNum * rowsPerPage, (pageNum + 1) * rowsPerPage)
                                .map((transaction, idx) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{pageNum * rowsPerPage + idx + 1}</TableCell>
                                    <TableCell>{transaction.to_account_num}</TableCell>
                                    <TableCell>{transaction.to_account_name}</TableCell>
                                    <TableCell>{transaction.to_account_bank}</TableCell>
                                    <TableCell align="right">{formatAmount(transaction.amount)}</TableCell>
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
                    count={transactionData ? transactionData?.total : 0}
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