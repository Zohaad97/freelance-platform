import { Add, Delete, Edit } from '@mui/icons-material'
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Formik, Field, Form, FieldArray, ErrorMessage, FieldProps } from 'formik'
import React from 'react'
import * as Yup from 'yup'

interface Education {
  type: string
  institute: string
  fromYear: string
  toYear: string
  isEditing: boolean
}

interface UserProfileFormValues {
  title: string
  about: string
  skills: string[]
  jobExperience: string
  education: Education[]
  linkedIn: string
  profilePicture: string
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  about: Yup.string().required('About is required'),
  jobExperience: Yup.string().required('Job experience is required'),
  linkedIn: Yup.string().url('Enter a valid URL').required('LinkedIn profile is required'),
  profilePicture: Yup.string().required('Profile picture is required'),
  education: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required('Type is required'),
        institute: Yup.string().required('Institute name is required'),
        fromYear: Yup.number()
          .typeError('Year must be a number')
          .integer('Year must be an integer')
          .min(1900, 'Year must be between 1900 and 2100')
          .max(2100, 'Year must be between 1900 and 2100')
          .required('Year is required'),
        toYear: Yup.number()
          .typeError('Year must be a number')
          .integer('Year must be an integer')
          .min(1900, 'Year must be between 1900 and 2100')
          .max(2100, 'Year must be between 1900 and 2100')
          .required('Year is required')
          .test(
            'is-greater',
            'To Year must be greater than or equal to From Year',
            function (value) {
              const { fromYear } = this.parent
              return value >= fromYear
            }
          ),
      })
    )
    .required('Education is required')
    .min(1, 'At least one education entry is required'),
})

const UserProfileForm: React.FC = () => {
  const initialValues: UserProfileFormValues = {
    title: '',
    about: '',
    skills: [],
    jobExperience: '',
    education: [],
    linkedIn: '',
    profilePicture: '',
  }

  const [skillInput, setSkillInput] = React.useState('')

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log(values)
      }}
    >
      {({ values, setFieldValue, errors }) => {
        console.log(errors)
        return (
          <Form>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Field name="title">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    helperText={<ErrorMessage name="title" />}
                  />
                )}
              </Field>

              <Field name="about">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="About"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    helperText={<ErrorMessage name="about" />}
                  />
                )}
              </Field>

              <Box>
                <Typography variant="subtitle1">Skills</Typography>
                <Box display="flex" flexDirection="row" gap={1} flexWrap="wrap">
                  {values.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => {
                        const newSkills = values.skills.filter((_, i) => i !== index)
                        setFieldValue('skills', newSkills)
                      }}
                      deleteIcon={<Delete />}
                    />
                  ))}
                  <TextField
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        setFieldValue('skills', [...values.skills, skillInput.trim()])
                        setSkillInput('')
                        e.preventDefault()
                      }
                    }}
                    label="Add skill"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              <Field name="jobExperience">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="Job Experience"
                    variant="outlined"
                    fullWidth
                    helperText={<ErrorMessage name="jobExperience" />}
                  />
                )}
              </Field>

              <Field name="linkedIn">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="LinkedIn Profile"
                    variant="outlined"
                    fullWidth
                    helperText={<ErrorMessage name="linkedIn" />}
                  />
                )}
              </Field>

              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1">Profile Picture</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  {values.profilePicture && (
                    <Avatar
                      alt="Profile Picture"
                      src={values.profilePicture}
                      sx={{ width: 56, height: 56 }}
                    />
                  )}
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }}
                    id="profile-picture-upload"
                    onChange={event => {
                      const file = event.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFieldValue('profilePicture', reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <label htmlFor="profile-picture-upload">
                    <IconButton color="primary" component="span">
                      <Add />
                    </IconButton>
                  </label>
                </Stack>
                <ErrorMessage name="profilePicture" />
              </Box>

              <FieldArray name="education">
                {({ push, remove, replace }) => (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="subtitle1">Education</Typography>
                    {values.education.map((education, index) => {
                      if (education.isEditing) {
                        return (
                          <EducationForm
                            key={index}
                            education={education}
                            index={index}
                            errorMessages={
                              errors.education ? (errors.education as unknown as Education[]) : []
                            }
                            onSubmit={v => {
                              replace(index, v)
                            }}
                          />
                        )
                      }

                      return (
                        <EducationSummary
                          education={education}
                          onEdit={() => replace(index, { ...education, isEditing: true })}
                          onDelete={() => remove(index)}
                        />
                      )
                    })}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => push({ type: '', institute: '', year: '', isEditing: true })}
                    >
                      Add Education
                    </Button>
                  </Box>
                )}
              </FieldArray>

              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

interface EducationSummaryProps {
  education: Education
}

interface EducationSummaryProps {
  education: Education
  onEdit: () => void
  onDelete: () => void
}

interface EducationFormProps {
  education: Education
  onSubmit: (v: Education) => void
  index: number
  errorMessages: Education[]
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  index: key,
  onSubmit,
  errorMessages,
}) => (
  <Box key={key} display="flex" flexDirection="column" gap={2}>
    <Field name={`education[${key}].type`}>
      {({ field }: FieldProps) => (
        <FormControl fullWidth variant="outlined">
          <InputLabel>Type</InputLabel>
          <Select {...field} label="Type">
            <MenuItem value="Degree">Degree</MenuItem>
            <MenuItem value="Diploma">Diploma</MenuItem>
            <MenuItem value="Certificate">Certificate</MenuItem>
          </Select>
          <ErrorMessage name={field.name} />
        </FormControl>
      )}
    </Field>
    <Field name={`education[${key}].institute`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="Institute Name"
          variant="outlined"
          fullWidth
          error={Boolean(errorMessages[key]?.institute)}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
    <Field name={`education[${key}].fromYear`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="Year"
          type="number"
          variant="outlined"
          fullWidth
          error={Boolean(errorMessages[key]?.fromYear)}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
    <Field name={`education[${key}].toYear`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="Year"
          type="number"
          variant="outlined"
          fullWidth
          error={Boolean(errorMessages[key]?.toYear)}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={Boolean(errorMessages.length > 0)}
      onClick={() => onSubmit({ ...education, isEditing: false })}
    >
      Submit
    </Button>
  </Box>
)

const EducationSummary: React.FC<EducationSummaryProps> = ({ education, onEdit, onDelete }) => {
  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">{education.type}</Typography>
          <Typography variant="body1">{education.institute}</Typography>
          <Typography variant="body2" color="textSecondary">
            {education.fromYear} - {education.toYear}
          </Typography>
        </Box>
        <Box>
          <IconButton color="primary" onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton color="secondary" onClick={onDelete}>
            <Delete />
          </IconButton>
        </Box>
      </Stack>
    </Paper>
  )
}

const UserProfilePage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Profile
        </Typography>
        <UserProfileForm />
      </Paper>
    </Container>
  )
}

export default UserProfilePage
