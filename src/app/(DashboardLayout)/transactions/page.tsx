"use client";
import ProtectedRoute from "@/components/containers/ProtectedRoute";
import PageContainer from "@/components/containers/PageContainer";
import {Box, Grid, InputLabel, MenuItem, FormControl, Button} from "@mui/material";
import TransactionTable, {TransactionData} from "@/components/widgets/TransactionTable";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment/moment";
import React, {useCallback, useEffect, useState} from "react";
import Select from "@mui/material/Select";
import {fetchData} from "@/utils/api/apiService";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import {useSession} from "next-auth/react";
import {STATUS_OPTIONS} from "@/utils/roles";

interface Filters {
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    status: string;
}

const emptyFilters: Filters = {startDate: null, endDate: null, status: ""};

export default function TransactionList() {
    const {data: session} = useSession();
    const [form, setForm] = useState<Filters>(emptyFilters);       // what's in the inputs
    const [filters, setFilters] = useState<Filters>(emptyFilters); // what's applied
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(0);
    const rowsPerPage = 10;
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [totalTransactionData, setTotalTransactionData] = useState<number>(0);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetchData(`/transactions`, true, {
                params: {
                    page: pageNum + 1,
                    per_page: rowsPerPage,
                    status: filters.status || 0,
                    start_date: filters.startDate ? filters.startDate.clone().startOf("day").unix() : 0,
                    // end of the selected day, so the end date is inclusive
                    end_date: filters.endDate ? filters.endDate.clone().add(1, "day").startOf("day").unix() : 0,
                },
            });
            setTransactionData(response.data);
            setTotalTransactionData(response.total);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [pageNum, filters]);

    useEffect(() => {
        if (session) loadData();
    }, [session, loadData]);

    const onSearch = () => {
        setPageNum(0);
        setFilters(form);
    };

    const onReset = () => {
        setPageNum(0);
        setForm(emptyFilters);
        setFilters(emptyFilters);
    };

    return (
        <ProtectedRoute>
            <PageContainer title="Transaction List" description="All transactions of your corporate">
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <DatePicker label="Start Date" value={form.startDate}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                        onChange={(value) => setForm({...form, startDate: value})}/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker label="End Date" value={form.endDate} minDate={form.startDate ?? undefined}
                                        slotProps={{textField: {size: 'small', fullWidth: true}}}
                                        onChange={(value) => setForm({...form, endDate: value})}/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select id="status" labelId="status-label" label="Status"
                                        value={form.status}
                                        onChange={(e) => setForm({...form, status: String(e.target.value)})}>
                                    <MenuItem value="">All</MenuItem>
                                    {STATUS_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={String(option.value)}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={12} justifyContent="flex-end" spacing={1}>
                            <Grid item xs={6} sm={2}>
                                <Button color="primary" variant="contained" size="small" fullWidth
                                        startIcon={<SearchOutlinedIcon/>} onClick={onSearch}>
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <Button color="primary" variant="outlined" size="small" fullWidth
                                        startIcon={<RestartAltOutlinedIcon/>} onClick={onReset}>
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TransactionTable data={transactionData} totalData={totalTransactionData} page={pageNum}
                                              perPage={rowsPerPage} loading={loading}
                                              onPageChange={(event, page) => setPageNum(page)}
                                              onAudited={loadData}/>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>
        </ProtectedRoute>
    );
}
