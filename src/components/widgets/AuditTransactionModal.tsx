import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";


interface AuditTransactionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitting?: boolean;
    action: string;
    ref_num: string;
}

const AuditTransactionModal = ({open, onClose, onSubmit, submitting, action, ref_num}: AuditTransactionModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Audit Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to <b>{action}</b> this transaction with Reference No.: <b>{ref_num}</b>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                <Button onClick={onSubmit} disabled={submitting}
                        color={action === "reject" ? "error" : "success"}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default AuditTransactionModal;