import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button, Alert, Chip,
} from '@mui/material';
import {useSession} from "next-auth/react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import TransactionDetailModal from "@/components/widgets/TransactionDetailModal";
import AuditTransactionModal from "@/components/widgets/AuditTransactionModal";
import {postData} from "@/utils/api/apiService";
import {errorMessage} from "@/utils/api/errors";
import {formatAmount} from "@/utils/format";
import {ROLE_APPROVER, STATUS_AWAITING_APPROVAL} from "@/utils/roles";

export interface TransactionData {
    id: string;
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
    onAudited?: () => void; // called after a successful approve/reject, to reload the data
    loading?: boolean;
}

const statusColor = (status: string) =>
    status === "Approved" ? "success" : status === "Rejected" ? "error" : "warning";

const TransactionTable = ({data, totalData, page, perPage, onPageChange, onAudited, loading}: TransactionTableProps) => {
    const {data: session} = useSession();
    const isApprover = session?.user?.role === ROLE_APPROVER;

    const [transactionID, setTransactionID] = useState<string>("");
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)
    const [alert, setAlert] = useState<{ message: string, isError: boolean } | null>(null);
    const [auditAction, setAuditAction] = useState<string>("");
    const [trxRefNum, setTrxRefNum] = useState("");
    const [openAuditModal, setOpenAuditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleOpenDetailModal = (id: string) => {
        setTransactionID(id)
        setOpenDetailModal(true)
    };
    const handleCloseDetailModal = () => setOpenDetailModal(false);

    const openAudit = (row: TransactionData, action: string) => {
        setAuditAction(action)
        setTransactionID(row.id)
        setTrxRefNum(row.ref_num)
        setOpenAuditModal(true)
    }

    const handleCloseAuditModal = () => {
        setOpenAuditModal(false)
        setAuditAction("")
        setTrxRefNum("")
    };

    const auditTransaction = async () => {
        setSubmitting(true);
        try {
            const response = await postData(`/transaction/${transactionID}/audit?action=${auditAction}`, {}, true);
            setAlert({message: `${trxRefNum}: ${response.message}`, isError: false});
            onAudited?.();
        } catch (error) {
            setAlert({message: `${trxRefNum}: ${errorMessage(error)}`, isError: true});
        } finally {
            setSubmitting(false);
            handleCloseAuditModal();
        }
    }

    return (
        <Paper>
            {alert ? (
                <Alert variant="outlined" severity={alert.isError ? "error" : "success"} onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            ) : null}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Reference No.</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell align="right">Records</TableCell>
                            <TableCell>From Account No.</TableCell>
                            <TableCell>Maker</TableCell>
                            <TableCell>Transfer Date</TableCell>
                            <TableCell>Status</TableCell>
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
                        ) : data && data.length > 0 ? (data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell sx={{fontFamily: "monospace", fontSize: 12}} title={row.ref_num}>
                                    {row.ref_num.slice(0, 10)}…
                                </TableCell>
                                <TableCell align="right">{formatAmount(row.total_transfer_amount)}</TableCell>
                                <TableCell align="right">{row.total_transfer_record}</TableCell>
                                <TableCell>{row.from_account_no}</TableCell>
                                <TableCell>{row.maker}</TableCell>
                                <TableCell sx={{whiteSpace: "nowrap"}}>{row.transfer_date}</TableCell>
                                <TableCell>
                                    <Chip label={row.status} color={statusColor(row.status)} size="small" variant="outlined"/>
                                </TableCell>
                                <TableCell sx={{whiteSpace: "nowrap"}}>
                                    {isApprover && row.status === STATUS_AWAITING_APPROVAL ? (
                                        <>
                                            <Button variant="text" startIcon={<CheckCircleOutlinedIcon/>}
                                                    onClick={() => openAudit(row, "approve")}
                                                    color="success" size="small">
                                                Approve
                                            </Button>
                                            <Button variant="text" startIcon={<CancelOutlinedIcon/>}
                                                    onClick={() => openAudit(row, "reject")}
                                                    color="error" size="small">
                                                Reject
                                            </Button>
                                        </>
                                    ) : null}
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
            {openDetailModal && transactionID ? (
                <TransactionDetailModal transactionID={transactionID} open={openDetailModal}
                                        onClose={handleCloseDetailModal}/>
            ) : null}
            <AuditTransactionModal open={openAuditModal} onClose={handleCloseAuditModal}
                                   onSubmit={auditTransaction} submitting={submitting}
                                   action={auditAction} ref_num={trxRefNum}/>
        </Paper>
    );
};

export default TransactionTable;
