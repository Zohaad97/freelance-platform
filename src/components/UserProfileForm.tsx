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
  FormHelperText,
} from '@mui/material'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Formik, Field, Form, FieldArray, ErrorMessage, FieldProps, FormikProps } from 'formik'
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from 'mui-tiptap'
import { useState } from 'react'
import React from 'react'
import * as Yup from 'yup'

import './RichTextEditor.css'

interface Education {
  type: string
  institute: string
  fromYear: string
  toYear: string
  isEditing: boolean
}
interface jobExperience {
  company: string
  position: string
  fromYear: string
  toYear: string
  isEditing: boolean
}

interface UserProfileFormValues {
  title: string
  about: string
  skills: string
  jobExperience: jobExperience[]
  education: Education[]
  linkedIn: string
  profilePicture: string
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  about: Yup.string().required('About is required'),
  linkedIn: Yup.string()
    .matches(/^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/gim, 'Enter correct url!')
    .required('Please enter Url'),
  profilePicture: Yup.string().required('Profile picture is required'),
  skills: Yup.string().required('Skills is required'),
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
  jobExperience: Yup.array()
    .of(
      Yup.object().shape({
        company: Yup.string().required('company is required'),
        position: Yup.string().required('position is required'),
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
    .required('Job Experience is required')
    .min(1, 'At least one Job Experience entry is required'),
})

const UserProfileForm: React.FC = () => {
  const initialValues: UserProfileFormValues = {
    title: '',
    about: '',
    skills: '',
    jobExperience: [],
    education: [],
    linkedIn: '',
    profilePicture: '',
  }

  const [skillInput, setSkillInput] = useState('')
  const [isAboutEmpty, setIsAboutEmpty] = useState(true)

  const HandleChange = ({ editor }: { editor: Editor }) => {
    const content = editor.getText().trim()
    setIsAboutEmpty(content.length > 0)
  }
  console.log(initialValues)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log(values)
      }}
    >
      {({ values, setFieldValue, errors, touched }: FormikProps<any>) => {
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
                    helperText={<ErrorMessage name={field.name} />}
                    error={!!errors[field.name]}
                  />
                )}
              </Field>

              <Field name="about">
                {({ field }: FieldProps) => (
                  <FormControl {...field} fullWidth error={touched.about && !!errors.about}>
                    <RichTextEditor
                      className={!isAboutEmpty ? 'rich-text-editor' : ''}
                      extensions={[StarterKit]}
                      onUpdate={HandleChange}
                      renderControls={() => (
                        <MenuControlsContainer>
                          <MenuSelectHeading />
                          <MenuDivider />
                          <MenuButtonBold />
                          <MenuButtonItalic />
                        </MenuControlsContainer>
                      )}
                    />
                    {!isAboutEmpty && (
                      <FormHelperText>
                        <ErrorMessage name={field.name} />
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              </Field>

              <Field name="skills">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="Add skill"
                    variant="outlined"
                    size="small"
                    helperText={<ErrorMessage name={field.name} />}
                    error={!!errors[field.name]}
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
                    helperText={<ErrorMessage name={field.name} />}
                    error={!!errors[field.name]}
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
                    {values.education.map((education: Education, index: number) => {
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

              {/* Job Experience Form */}

              <FieldArray name="jobExperience">
                {({ push, remove, replace }) => (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="subtitle1">Job Experience</Typography>
                    {values.jobExperience.map((jobExperience: jobExperience, index: number) => {
                      if (jobExperience.isEditing) {
                        return (
                          <JobExperienceForm
                            key={index}
                            jobExperience={jobExperience}
                            index={index}
                            errorMessages={
                              errors.jobExperience
                                ? (errors.jobExperience as unknown as jobExperience[])
                                : []
                            }
                            onSubmit={v => {
                              replace(index, v)
                            }}
                          />
                        )
                      }

                      // Job Experience Summary
                      return (
                        <JobExperienceSummary
                          jobExperience={jobExperience}
                          onEdit={() => replace(index, { ...jobExperience, isEditing: true })}
                          onDelete={() => remove(index)}
                        />
                      )
                    })}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => push({ company: '', position: '', year: '', isEditing: true })}
                    >
                      Add Job Experience
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

interface JobExperienceSummaryProps {
  jobExperience: jobExperience
  onEdit: () => void
  onDelete: () => void
}

interface EducationFormProps {
  education: Education
  onSubmit: (v: Education) => void
  index: number
  errorMessages: Education[]
}
interface JobExperienceFormProps {
  jobExperience: jobExperience
  onSubmit: (v: jobExperience) => void
  index: number
  errorMessages: jobExperience[]
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

const JobExperienceForm: React.FC<JobExperienceFormProps> = ({
  jobExperience,
  index: key,
  onSubmit,
  errorMessages,
}) => (
  <Box key={key} display="flex" flexDirection="column" gap={2}>
    <Field name={`jobExperience[${key}].company`}>
      {({ field }: FieldProps) => (
        <FormControl fullWidth variant="outlined">
          <TextField
            {...field}
            label="Company Name"
            variant="outlined"
            fullWidth
            error={Boolean(errorMessages[key]?.company)}
            helperText={<ErrorMessage name={field.name} />}
          />
        </FormControl>
      )}
    </Field>
    <Field name={`jobExperience[${key}].position`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="Position"
          variant="outlined"
          fullWidth
          error={Boolean(errorMessages[key]?.position)}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
    <Field name={`jobExperience[${key}].fromYear`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="From Year"
          type="number"
          variant="outlined"
          fullWidth
          error={Boolean(errorMessages[key]?.fromYear)}
          helperText={<ErrorMessage name={field.name} />}
        />
      )}
    </Field>
    <Field name={`jobExperience[${key}].toYear`}>
      {({ field }: FieldProps) => (
        <TextField
          {...field}
          label="To Year"
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
      onClick={() => onSubmit({ ...jobExperience, isEditing: false })}
    >
      Submit
    </Button>
  </Box>
)

const JobExperienceSummary: React.FC<JobExperienceSummaryProps> = ({
  jobExperience,
  onEdit,
  onDelete,
}) => (
  <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="subtitle1">{jobExperience.company}</Typography>
        <Typography variant="body1">{jobExperience.position}</Typography>
        <Typography variant="body2" color="textSecondary">
          {jobExperience.fromYear} - {jobExperience.toYear}
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
