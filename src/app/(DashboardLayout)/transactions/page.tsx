"use client";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import PageContainer from "@/components/containers/PageContainer";
import {Box, Grid, InputLabel, MenuItem, FormControl, TextField, Button} from "@mui/material";
import TransactionTable, {TransactionData} from "@/components/widgets/TransactionTable";
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import Select from "@mui/material/Select";
import {fetchData} from "@/utils/api/apiService";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';

interface corporation {
    id: number;
    account_num: string;
    name: string;
}

export default function TransactionList() {
    const [startDateField, setStartDateField] = useState<moment.Moment | null>();
    const [endDateField, setEndDateField] = useState<moment.Moment | null>();
    const [statusSelect, setStatusSelect] = useState<string>("");
    const [corpData, setCorpData] = useState<corporation[]>([])
    const [corpField, setCorpField] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [totalTrasnactionData, setTotalTrasnactionData] = useState<number>(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        console.log(page)
        setPageNum(page);
    };

    const onReset = () => {
        setStartDateField(null)
        setEndDateField(null)
        setStatusSelect("");
        setCorpField("");
        setPageNum(0);
        setRowsPerPage(10)
        loadData(pageNum + 1, rowsPerPage)
    }

    const onSearch = async () => {
        loadData(pageNum + 1, rowsPerPage)
    }

    const loadData = async (page: number, perPage: number) => {
        setLoading(true);
        try {
            fetchData(`/transactions`, true, {
                params: {
                    page: page,
                    per_page: perPage,
                    status: statusSelect,
                    corporate_id: corpField,
                    start_date: startDateField ? startDateField!.unix() : 0,
                    end_date: endDateField ? endDateField!.unix() : 0,
                }
            }).then(
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
        try {
            fetchData(`/corporates`).then(
                response => {
                    setCorpData(response);
                }
            )
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }, [pageNum, rowsPerPage]);

    return (
        <ProtectedRoute>
            <PageContainer title="Transaction List" description="this is Transaction List Page">
                <Box>
                    <Grid container spacing={2}>
                        <Grid container item xs={6}>
                            <Grid item xs={6} pr={1}>
                                <DatePicker label="Start Date" name="start_date" value={startDateField}
                                            slotProps={{textField: {size: 'small', fullWidth: true}}}
                                            onChange={(value) => setStartDateField(value)}
                                />
                            </Grid>
                            <Grid item xs={6} pl={1}>
                                <DatePicker label="End Date" name="end_date" value={endDateField}
                                            slotProps={{textField: {size: 'small', fullWidth: true}}}
                                            onChange={(value) => setEndDateField(value)}/>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="corp-num-label">From Account No.</InputLabel>
                                <Select id="corp-num" labelId="corp-num-label" name="corp-num" label="From Account No."
                                        value={corpField}
                                        onChange={(e) => setCorpField(e.target.value)}
                                >
                                    {corpData.map((item: corporation) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.account_num} ({item.name})
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select id="status" labelId="status-label" name="status" label="Status"
                                        value={statusSelect}
                                        onChange={(e) => setStatusSelect(e.target.value)}
                                >
                                    <MenuItem key={1} value={1}>Waiting Approval</MenuItem>
                                    <MenuItem key={2} value={2}>Successfully</MenuItem>
                                    <MenuItem key={3} value={3}>Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={2} pr={1}>
                                <Button color="primary" variant="contained" size="small" fullWidth
                                        startIcon={<SearchOutlinedIcon/>} onClick={onSearch}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={2} pl={1}>
                                <Button color="primary" variant="outlined" size="small" fullWidth
                                        startIcon={<RestartAltOutlinedIcon/>} onClick={onReset}
                                >
                                    Reset
                                </Button>
                            </Grid>
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
