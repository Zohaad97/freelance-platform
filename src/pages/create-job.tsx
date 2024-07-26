import { Container, Typography, Paper } from '@mui/material'

import JobPostForm from '@/components/JobPostForm'

const JobPostPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Job Post
        </Typography>
        <JobPostForm />
      </Paper>
    </Container>
  )
}

export default JobPostPage
