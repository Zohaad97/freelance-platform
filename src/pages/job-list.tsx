import React from 'react';
import { Container, Grid, TextField, MenuItem, Checkbox, FormControlLabel, Slider, Button, Card, CardContent, Typography, Chip, IconButton, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const JobsListPage = () => {
    return (
        <Container>
            {/* Header */}
            <Grid container justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
                <Grid item>
                    <Typography variant="h4">Logo</Typography>
                </Grid>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item><Button>Home</Button></Grid>
                        <Grid item><Button>Jobs</Button></Grid>
                        <Grid item><Button>My Profile</Button></Grid>
                        <Grid item><Button>Messages</Button></Grid>
                        <Grid item><Button>User</Button></Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={2}>
                {/* Sidebar */}
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Search Jobs"
                        InputProps={{
                            endAdornment: <IconButton><SearchIcon /></IconButton>
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6">Filters</Typography>
                    <TextField fullWidth select label="Category" sx={{ mb: 2 }}>
                        <MenuItem value="design">Design</MenuItem>
                        <MenuItem value="development">Development</MenuItem>
                        <MenuItem value="writing">Writing</MenuItem>
                        <MenuItem value="marketing">Marketing</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Location" sx={{ mb: 2 }} />
                    <FormControlLabel control={<Checkbox />} label="Full-time" />
                    <FormControlLabel control={<Checkbox />} label="Part-time" />
                    <FormControlLabel control={<Checkbox />} label="Contract" />
                    <FormControlLabel control={<Checkbox />} label="Internship" />
                    <Typography variant="subtitle1" gutterBottom>Salary Range</Typography>
                    <Slider value={[30, 70]} />
                    <Typography variant="subtitle1" gutterBottom>Date Posted</Typography>
                    <FormControlLabel control={<Checkbox />} label="Today" />
                    <FormControlLabel control={<Checkbox />} label="Last 3 days" />
                    <FormControlLabel control={<Checkbox />} label="Last week" />
                    <FormControlLabel control={<Checkbox />} label="Last month" />
                    <Button variant="outlined" fullWidth sx={{ mt: 2 }}>Clear Filters</Button>
                </Grid>

                {/* Jobs List */}
                <Grid item xs={12} md={9}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Newly Created Jobs</Typography>
                    <Grid container spacing={2}>
                        {/* Job Card Example */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Frontend Developer</Typography>
                                    <Typography variant="subtitle1">Company XYZ</Typography>
                                    <Grid container alignItems="center" sx={{ my: 1 }}>
                                        <LocationOnIcon fontSize="small" />
                                        <Typography variant="body2">Remote</Typography>
                                    </Grid>
                                    <Chip label="Full-time" />
                                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                        Short description of the job goes here. It should provide a brief overview of the job requirements and responsibilities.
                                    </Typography>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained">Apply</Button>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>


                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Frontend Developer</Typography>
                                    <Typography variant="subtitle1">Company XYZ</Typography>
                                    <Grid container alignItems="center" sx={{ my: 1 }}>
                                        <LocationOnIcon fontSize="small" />
                                        <Typography variant="body2">Remote</Typography>
                                    </Grid>
                                    <Chip label="Full-time" />
                                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                        Short description of the job goes here. It should provide a brief overview of the job requirements and responsibilities.
                                    </Typography>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained">Apply</Button>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>




                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Frontend Developer</Typography>
                                    <Typography variant="subtitle1">Company XYZ</Typography>
                                    <Grid container alignItems="center" sx={{ my: 1 }}>
                                        <LocationOnIcon fontSize="small" />
                                        <Typography variant="body2">Remote</Typography>
                                    </Grid>
                                    <Chip label="Full-time" />
                                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                        Short description of the job goes here. It should provide a brief overview of the job requirements and responsibilities.
                                    </Typography>
                                    <Grid container justifyContent="flex-end">
                                        <Button variant="contained">Apply</Button>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* More Job Cards */}
                    </Grid>
                    <Pagination count={10} sx={{ mt: 3 }} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default JobsListPage;
