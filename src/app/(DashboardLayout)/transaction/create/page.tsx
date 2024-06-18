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

const CreateTransactionPage = () => {
    const [instructionField, setInstructionField] = useState("");
    const [datetimeField, setDatetimeField] = useState<moment.Moment | null>(moment());
    const [file, setFile] = useState<File | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [alertMsg, setAlertMsg] = useState<string>("");

    const handleInstructionChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
        setInstructionField(value)
    }

    const handleFileChange = (files: FileList) => {
        setFile(files[0]);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const instruction = formData.get('instruction')
        const records = formData.get('records')
        const amounts = formData.get('amounts')
        const datetime = datetimeField!.unix()

        formData.append("instruction_type", String(instruction));
        formData.append("transaction_date", String(datetime));
        formData.append("total_record", String(records));
        formData.append("total_amount", String(amounts));
        formData.append('file', file!);
        try {
            postData("/transaction/upload", formData, true, {})
                .then(response => {
                    console.log(response);
                    setIsError(false);
                    setAlertMsg(response.message)
                    event.target.reset();
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    if (error.response.data) {
                        setAlertMsg(String(error.response.data.message));
                        setIsError(true);
                    }
                });
        } catch (error) {
            setAlertMsg(String(error));
            setIsError(true);
            console.error('Error download template:', error);
        }
    }

    const onDownloadTemplate = async () => {
        try {
            fetchData("/transaction/download-template", true, {responseType: "blob"})
                .then(response => {
                    let file = window.URL.createObjectURL(response);
                    window.location.assign(file);
                });
        } catch (error) {
            console.error('Error download template:', error);
        }
    }

    return (
        <ProtectedRoute>
            <PageContainer title="Create Transaction" description="Create Transaction page for banking-transaction app">
                <form onSubmit={handleSubmit}>
                    <Stack mb={3}>
                        <Box mb={"20px"}>
                            <Typography variant="h3">
                                Create Transaction
                            </Typography>
                        </Box>
                        <Box>
                            <FileUpload
                                multiFile={false}
                                title=""
                                label="Drag and drop a csv file or click to select"
                                acceptedType={'.csv'}
                                allowedExtensions={['csv']}
                                maxUploadFiles={1}
                                onFilesChange={handleFileChange}
                                value={file ? [file] : []}
                            />
                        </Box>
                        <Box mt={"5px"}>
                            <Button startIcon={<DownloadOutlinedIcon/>} onClick={onDownloadTemplate}
                                    size="small" variant="text"
                            >
                                Download Template
                            </Button>
                        </Box>

                        {
                            alertMsg ? (
                                <Alert variant="outlined" severity={isError ? "error" : "success"}>
                                    {alertMsg}
                                </Alert>
                            ) : null
                        }

                        <Box mt={"5px"}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="instruction"
                                mb="5px" mt="25px"
                            >
                                Total Transfer Record
                            </Typography>
                            <RadioGroup
                                aria-labelledby="instruction"
                                name="instruction"
                                value={instructionField}
                                onChange={handleInstructionChange}
                            >
                                <FormControlLabel value="immediate" control={<Radio/>} label="Immediate"/>
                                <FormControlLabel value="standing" control={<Radio/>} label="Standing Instruction"/>
                            </RadioGroup>

                            {
                                instructionField === "standing" ? (
                                    <Box mt={"5px"}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            component="label"
                                            htmlFor="datetime"
                                            mb="5px" mt="5px"
                                        >
                                            Transfer Date & Time
                                        </Typography>
                                        <Box>
                                            <DateTimePicker name="datetime" defaultValue={moment()} disablePast={true}
                                                            value={datetimeField}
                                                            onChange={(value) => setDatetimeField(value)}/>
                                        </Box>
                                    </Box>
                                ) : (null)
                            }

                            <Box mt={"5px"}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="records"
                                    mb="5px" mt="25px"
                                >
                                    Total Transfer Record
                                </Typography>
                                <CustomTextField id="records" type="number" name="records" variant="outlined"
                                                 fullWidth/>
                            </Box>

                            <Box mt={"5px"}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    htmlFor="amounts"
                                    mb="5px" mt="25px"
                                >
                                    Total Transfer Amount
                                </Typography>
                                <CustomTextField id="amounts" type="number" name="amounts" variant="outlined"
                                                 fullWidth/>
                            </Box>
                        </Box>
                    </Stack>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </PageContainer>
        </ProtectedRoute>
    );
}

export default CreateTransactionPage;