import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";


interface AuditTransactionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    action: string;
    ref_num: string;
}

const AuditTransactionModal = ({open, onClose, onSubmit, action, ref_num}: AuditTransactionModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmit,
            }}
        >
            <DialogTitle>Audit Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to <b>{action}</b> this transaction with Reference No.: <b>{ref_num}</b>?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}


export default AuditTransactionModal;