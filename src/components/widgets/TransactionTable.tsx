import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button, Alert,
} from '@mui/material';
import {useSession} from "next-auth/react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TransactionDetailModal from "@/components/widgets/TransactionDetailModal";
import AuditTransactionModal from "@/components/widgets/AuditTransactionModal";
import {postData} from "@/utils/api/apiService";

export interface TransactionData {
    id: number;
    ref_num: string;
    total_transfer_amount: number;
    total_transfer_record: number;
    from_account_no: string;
    maker: string;
    transfer_date: string;
    status: string;
}

type TransactionTableProps = {
    data: TransactionData[];
    totalData: number;
    page: number;
    perPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
    loading?: boolean;
}

const TransactionTable = ({data, totalData, page, perPage, onPageChange, loading}: TransactionTableProps) => {
    const {data: session, status} = useSession();
    const role = session?.user?.role as number
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)
    const handleOpenDetailModal = (id: React.SetStateAction<number>) => {
        setTransactionID(id)
        setOpenDetailModal(true)
    };
    const handleCloseDetailModal = () => setOpenDetailModal(false);
    const [transactionID, setTransactionID] = useState<number>(0);
    const [alertMsg, setAlertMsg] = useState<string>("");
    const [auditAction, setAuditAction] = useState<string>("");
    const [trxRefNum, setTrxRefNum] = useState("");
    const [openAuditModal, setOpenAuditModal] = useState(false);
    const handleCloseAuditModal = () => {
        setOpenAuditModal(false)
        setAuditAction("")
        setTrxRefNum("")
        setTransactionID(0)
    };

    const auditTransaction = async (trxID: number, action: string) => {
        try {
            postData(`/transaction/${trxID}/audit?action=${action}`, {}, true).then(
                response => {
                    setAlertMsg(trxRefNum + ": " + response.message)
                    handleCloseAuditModal()
                }
            )
        } catch (error) {
            console.error('Post error:', error);
        }
    }

    return (
        <Paper>
            {
                alertMsg ? (
                    <Alert variant="outlined" severity={"info"}>
                        {alertMsg}
                    </Alert>
                ) : null
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reference No.</TableCell>
                            <TableCell>Total Transfer Amount</TableCell>
                            <TableCell>Total Transfer Record</TableCell>
                            <TableCell>From Account No</TableCell>
                            <TableCell>Maker</TableCell>
                            <TableCell>Transfer Date</TableCell>
                            <TableCell>Operation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data ? (data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.ref_num}</TableCell>
                                <TableCell>{row.total_transfer_amount}</TableCell>
                                <TableCell>{row.total_transfer_record}</TableCell>
                                <TableCell>{row.from_account_no}</TableCell>
                                <TableCell>{row.maker}</TableCell>
                                <TableCell>{row.transfer_date}</TableCell>
                                <TableCell>
                                    {
                                        role == 2 ? (
                                            <>
                                                <Button variant="text" startIcon={<CheckCircleOutlinedIcon/>}
                                                        onClick={() => {
                                                            setOpenAuditModal(true)
                                                            setAuditAction("approve")
                                                            setTransactionID(row.id)
                                                            setTrxRefNum(row.ref_num)
                                                        }}
                                                        color="success"
                                                        size="small">
                                                    Approve
                                                </Button>
                                                <Button variant="text" startIcon={<CancelOutlinedIcon/>}
                                                        onClick={() => {
                                                            setOpenAuditModal(true)
                                                            setAuditAction("reject")
                                                            setTransactionID(row.id)
                                                            setTrxRefNum(row.ref_num)
                                                        }}
                                                        color="error"
                                                        size="small">
                                                    Reject
                                                </Button>
                                            </>
                                        ) : (null)
                                    }
                                    <Button
                                        onClick={() => handleOpenDetailModal(row.id)}
                                        startIcon={<VisibilityOutlinedIcon/>}
                                        size="small" variant="text"
                                    >
                                        Detail
                                    </Button>
                                </TableCell>
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
                count={totalData}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={perPage}
                rowsPerPageOptions={[perPage]}
            />
            {
                transactionID ? (<TransactionDetailModal transactionID={transactionID} open={openDetailModal}
                                                         onClose={handleCloseDetailModal}/>) : null
            }
            <AuditTransactionModal open={openAuditModal} onClose={handleCloseAuditModal}
                                   onSubmit={async () => auditTransaction(transactionID, auditAction)}
                                   action={auditAction} ref_num={trxRefNum}/>
        </Paper>
    );
};

export default TransactionTable;
