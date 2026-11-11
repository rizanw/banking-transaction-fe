"use client";
import PageContainer from "@/components/containers/PageContainer";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import {Alert, Box, Button, FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";
import FileUpload from "react-mui-fileuploader"
import React, {ChangeEvent, FormEvent, useState} from "react";
import CustomTextField from "@/components/forms/CustomTextField";
import {Stack} from "@mui/system";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import {DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {fetchData, postData} from "@/utils/api/apiService";
import {errorMessage, rowErrors} from "@/utils/api/errors";

type UploadedFile = Blob & { name: string };

const CreateTransactionPage = () => {
    const [instructionField, setInstructionField] = useState("immediate");
    const [datetimeField, setDatetimeField] = useState<moment.Moment | null>(moment().add(1, "hour"));
    const [file, setFile] = useState<UploadedFile | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0); // remounts the uploader to clear it
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState<{ message: string, isError: boolean, details: string[] } | null>(null);

    const handleInstructionChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
        setInstructionField(value)
    }

    const handleFileChange = (files: UploadedFile[]) => {
        setFile(files.length > 0 ? files[0] : null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget;

        if (!file) {
            setAlert({message: "Please choose a CSV file to upload.", isError: true, details: []});
            return;
        }
        if (instructionField === "standing" && (!datetimeField || !datetimeField.isValid())) {
            setAlert({message: "Please choose a transfer date.", isError: true, details: []});
            return;
        }

        const values = new FormData(form);
        const formData = new FormData();
        formData.append("instruction_type", instructionField);
        if (instructionField === "standing") {
            formData.append("transaction_date", String(datetimeField!.unix()));
        }
        formData.append("total_record", String(values.get("records")));
        formData.append("total_amount", String(values.get("amounts")));
        formData.append("file", file, file.name);

        setSubmitting(true);
        try {
            const response = await postData("/transaction/upload", formData, true);
            setAlert({message: response.message === "success" ? "Transaction submitted for approval." : response.message, isError: false, details: []});
            form.reset();
            setFile(null);
            setFileInputKey(k => k + 1);
        } catch (error) {
            setAlert({message: errorMessage(error), isError: true, details: rowErrors(error)});
        } finally {
            setSubmitting(false);
        }
    }

    const onDownloadTemplate = async () => {
        try {
            const blob = await fetchData("/transaction/download-template", true, {responseType: "blob"});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "transaction_template.csv";
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setAlert({message: errorMessage(error, "Failed to download the template."), isError: true, details: []});
        }
    }

    return (
        <ProtectedRoute>
            <PageContainer title="Create Transaction" description="Upload a batch of transfers for approval">
                <form onSubmit={handleSubmit}>
                    <Stack mb={3}>
                        <Box mb={"20px"}>
                            <Typography variant="h3">
                                Create Transaction
                            </Typography>
                        </Box>
                        <Box>
                            <FileUpload
                                key={fileInputKey}
                                multiFile={false}
                                title=""
                                header="Drag and drop a CSV file"
                                acceptedType={'.csv'}
                                allowedExtensions={['csv']}
                                maxUploadFiles={1}
                                onFilesChange={handleFileChange}
                                onError={(error: string) => console.error(error)}
                            />
                        </Box>
                        <Box mt={"5px"}>
                            <Button startIcon={<DownloadOutlinedIcon/>} onClick={onDownloadTemplate}
                                    size="small" variant="text">
                                Download Template
                            </Button>
                        </Box>
                        {alert ? (
                            <Alert variant="outlined" severity={alert.isError ? "error" : "success"}
                                   onClose={() => setAlert(null)}>
                                {alert.message}
                                {alert.details.length > 0 ? (
                                    <ul style={{margin: "8px 0 0", paddingLeft: "20px"}}>
                                        {alert.details.map(detail => <li key={detail}>{detail}</li>)}
                                    </ul>
                                ) : null}
                            </Alert>
                        ) : null}
                        <Box mt={"5px"}>
                            <Typography variant="subtitle1" fontWeight={600} component="label"
                                        htmlFor="instruction" mb="5px" mt="25px">
                                Instruction Type
                            </Typography>
                            <RadioGroup aria-labelledby="instruction" name="instruction"
                                        value={instructionField} onChange={handleInstructionChange}>
                                <FormControlLabel value="immediate" control={<Radio/>} label="Immediate"/>
                                <FormControlLabel value="standing" control={<Radio/>} label="Standing Instruction (scheduled)"/>
                            </RadioGroup>
                            {instructionField === "standing" ? (
                                <Box mt={"5px"}>
                                    <Typography variant="subtitle1" fontWeight={600} component="label"
                                                htmlFor="datetime" mb="5px" mt="5px">
                                        Transfer Date & Time
                                    </Typography>
                                    <Box>
                                        <DateTimePicker name="datetime" disablePast={true}
                                                        value={datetimeField}
                                                        onChange={(value) => setDatetimeField(value)}/>
                                    </Box>
                                </Box>
                            ) : null}
                            <Box mt={"5px"}>
                                <Typography variant="subtitle1" fontWeight={600} component="label"
                                            htmlFor="records" mb="5px" mt="25px">
                                    Total Transfer Record
                                </Typography>
                                <CustomTextField required id="records" type="number" name="records" variant="outlined"
                                                 inputProps={{min: 1, step: 1}} fullWidth
                                                 helperText="Number of rows in the CSV file"/>
                            </Box>
                            <Box mt={"5px"}>
                                <Typography variant="subtitle1" fontWeight={600} component="label"
                                            htmlFor="amounts" mb="5px" mt="25px">
                                    Total Transfer Amount
                                </Typography>
                                <CustomTextField required id="amounts" type="number" name="amounts" variant="outlined"
                                                 inputProps={{min: 0.01, step: "any"}} fullWidth
                                                 helperText="Sum of transfer_amount in the CSV file"/>
                            </Box>
                        </Box>
                    </Stack>
                    <Button color="primary" variant="contained" size="large" fullWidth type="submit"
                            disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </PageContainer>
        </ProtectedRoute>
    );
}

export default CreateTransactionPage;
