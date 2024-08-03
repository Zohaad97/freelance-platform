import styled from '@emotion/styled'
import { Add, Delete, Description, Edit } from '@mui/icons-material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
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
  Grid,
  Input,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
  CardActions,
} from '@mui/material'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {
  Formik,
  Field,
  Form,
  FieldArray,
  ErrorMessage,
  FieldProps,
  FormikProps,
  useFormik,
} from 'formik'
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
interface Project {
  title: string
  description: string
  images: string[]
  isEditing: boolean
}

interface UserProfileFormValues {
  title: string
  about: string
  skills: string
  jobExperience: jobExperience[]
  education: Education[]
  projects: Project[]
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
  projects: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        images: Yup.array().required('Images is required').min(1, 'At least one Image is required'),
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
    projects: [],
    linkedIn: '',
    profilePicture: '',
  }

  const [skillInput, setSkillInput] = useState('')
  const [isAboutEmpty, setIsAboutEmpty] = useState(true)

  const HandleChange = ({ editor }: { editor: Editor }) => {
    const content = editor.getText().trim()
    setIsAboutEmpty(content.length > 0)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log(values)
      }}
    >
      {({ values, setFieldValue, errors, touched }: FormikProps<any>) => {
        console.log({ errors, values })
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

              {/* Projects Section  */}

              <FieldArray name="projects">
                {({ push, remove, replace }) => (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="subtitle1">Projects</Typography>
                    {values.projects.map((project: Project, index: number) => {
                      if (project.isEditing) {
                        return (
                          <ProjectForm
                            key={index}
                            project={project}
                            index={index}
                            errorMessages={
                              errors.projects ? (errors.projects as unknown as Project[]) : []
                            }
                            onSubmit={v => {
                              replace(index, v)
                            }}
                          />
                        )
                      }

                      // Project Summary
                      return (
                        <ProjectSummary
                          projects={project}
                          onEdit={() => replace(index, { ...project, isEditing: true })}
                          onDelete={() => remove(index)}
                        />
                      )
                    })}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        push({ title: '', description: '', images: [], isEditing: true })
                      }
                    >
                      Add Project
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
interface ProjectSummaryProps {
  projects: Project
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

interface ProjectFormProps {
  project: Project
  onSubmit: (v: Project) => void
  index: number
  errorMessages: Project[]
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

interface ImageCardType {
  image: string
  onEdit: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
}

const ImageCard = ({ image, onEdit, onDelete }: ImageCardType) => (
  <Card sx={{ margin: 2, width: 120, height: 'auto' }}>
    <CardMedia component="img" height="140" image={image} alt="Image" />
    <CardActions>
      <Button component="label" role={undefined} tabIndex={-1} startIcon={<Edit />}>
        <VisuallyHiddenInput onChange={event => onEdit(event)} itemType="image/*" type="file" />
      </Button>
      <IconButton aria-label="delete" onClick={onDelete}>
        <Delete />
      </IconButton>
    </CardActions>
  </Card>
)

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  index: key,
  onSubmit,
  errorMessages,
}) => {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    push: (obj: string) => void
  ) => {
    const files = event.currentTarget.files
    if (files) {
      const fileArray = Array.from(files)
      const previewUrls = fileArray.map(file => URL.createObjectURL(file))
      previewUrls.forEach(url => push(url))
    }
  }

  const handleEdit = (
    event: React.ChangeEvent<HTMLInputElement>,
    replace: (obj: string) => void
  ) => {
    const files = event.currentTarget.files
    if (files) {
      const fileArray = Array.from(files)
      const previewUrls = fileArray.map(file => URL.createObjectURL(file))
      previewUrls.forEach(url => replace(url))
    }
  }
  return (
    <Box key={key} display="flex" flexDirection="column" gap={2}>
      <Field name={`projects[${key}].title`}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            label="Title"
            variant="outlined"
            fullWidth
            error={Boolean(errorMessages[key]?.title)}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
      <Field name={`projects[${key}].description`}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            error={Boolean(errorMessages[key]?.description)}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
      {/* <ImageUploadForm /> */}

      <FieldArray name={`projects[${key}].images`}>
        {({ push, remove, replace }) => (
          <>
            <ImageList sx={{ width: 'auto', height: 'auto' }} cols={3}>
              {project.images.map((preview, index: number) => (
                <ImageListItem key={index}>
                  <ImageCard
                    image={preview}
                    onDelete={() => remove(index)}
                    onEdit={event => handleEdit(event, v => replace(index, v))}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Field name={`projects[${key}].upload-image`}>
              {({ field }: FieldProps) => (
                <FormControl fullWidth variant="outlined">
                  <Button
                    {...field}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      onChange={event => handleFileChange(event, push)}
                      multiple
                      itemType="image/*"
                      type="file"
                    />
                  </Button>
                </FormControl>
              )}
            </Field>
          </>
        )}
      </FieldArray>


      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={Boolean(errorMessages.length > 0)}
        onClick={() => onSubmit({ ...project, isEditing: false })}
      >
        Submit
      </Button>
    </Box>
  )
}

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

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ projects, onEdit, onDelete }) => {
  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">{projects.title}</Typography>
          <Typography variant="body1">{projects.description}</Typography>
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

interface FormValues {
  images: File[]
}

const validationSchemaImageUploadForm = Yup.object({
  images: Yup.array()
    .of(Yup.mixed().required('A file is required'))
    .min(1, 'At least one image is required')
    .required('At least one image is required'),
})

const ImageUploadForm: React.FC = () => {
  const [previews, setPreviews] = useState<string[]>([])
  const formik = useFormik<FormValues>({
    initialValues: {
      images: [],
    },
    validationSchema: validationSchemaImageUploadForm,
    onSubmit: values => {
      console.log(values)
    },
  })

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    push: (obj: any) => void
  ) => {
    const files = event.currentTarget.files
    if (files) {
      const fileArray = Array.from(files)
      fileArray.forEach(file => push(file))

      const previewUrls = fileArray.map(file => URL.createObjectURL(file))
      setPreviews(previews.concat(previewUrls))
    }
  }
  return (
    <></>
    // <FieldArray name="images">
    //   {({ push, remove, replace }) => (
    //     <FormControl fullWidth variant="outlined">
    //       <Box>
    //         <Button variant="contained" component="label">
    //           Upload Images
    //           <input
    //             type="file"
    //             multiple
    //             hidden
    //             onChange={event => handleFileChange(event, push)}
    //           />
    //         </Button>
    //         {formik.errors.images && formik.touched.images ? (
    //           Array.isArray(formik.errors.images) ? (
    //             formik.errors.images.map((error, index) => (
    //               <Typography color="error" key={index}>
    //                 {typeof error === 'string' ? error : 'Invalid file'}
    //               </Typography>
    //             ))
    //           ) : (
    //             <Typography color="error">{formik.errors.images}</Typography>
    //           )
    //         ) : null}
    //         <Grid container spacing={2} mt={2}>
    //           {previews.map((preview, index) => (
    //             <Grid item key={index}>
    //               <img
    //                 src={preview}
    //                 alt={`Preview ${index}`}
    //                 style={{ width: 100, height: 100, objectFit: 'cover' }}
    //               />
    //               <Button
    //                 variant="contained"
    //                 color="secondary"
    //                 onClick={() => {
    //                   remove(index)
    //                   setPreviews(previews.filter((_, i) => i !== index))
    //                 }}
    //               >
    //                 Remove
    //               </Button>
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Box>
    //     </FormControl>
    //   )}
    // </FieldArray>
  )
}
