import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Autocomplete,
  Chip,
  Checkbox,
  FormGroup,
  Grid,
  FormHelperText,
} from '@mui/material'
import { Formik, Field, Form, ErrorMessage, FormikProps, FieldProps } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'

import MultipleSelectCheckmarks from '@/utils/MultiSelect'

import categoriesSkillsData from '../data/categoriesSkillsData.json'
import countries from '../data/countries.json'

interface JobPostFormValues {
  jobTitle: string
  jobDescription: string
  jobType: 'fixed' | 'hourly'
  costRange: number | [number, number]
  estimatedDuration: string
  skills: string[]
  categories: string[]
  location: string[] | boolean
  jobTypes: string[]
}

const jobType = ['Part Time', 'Full time', 'Contract', 'Internship']

const JobPostForm: React.FC = () => {
  const [isRemoteJob, setIsRemoteJob] = useState<boolean>(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const initialValues: JobPostFormValues = {
    jobTitle: '',
    jobDescription: '',
    jobType: 'fixed',
    costRange: 0,
    estimatedDuration: '',
    skills: [],
    categories: [],
    location: [],
    jobTypes: [],
  }

  type CategoriesSkills = {
    [key: string]: string[]
  }

  const categoriesSkills: CategoriesSkills = categoriesSkillsData
  const extractCategoryNames = () => {
    const categoryNames = Object.keys(categoriesSkills)
    setCategories(categoryNames)
  }

  useEffect(() => {
    extractCategoryNames()
  }, [])

  const validationSchema = useMemo(() => {
    return Yup.object({
      jobTitle: Yup.string()
        .max(800, 'Job title must be at most 800 characters')
        .required('Job title is required'),
      jobDescription: Yup.string()
        .max(2000, 'Job description must be at most 2000 characters')
        .required('Job description is required'),
      jobType: Yup.string().required('Job type is required'),
      costRange: Yup.number()
        .min(1, 'Cost Range must be greater than 0')
        .required('Cost range is required'),
      estimatedDuration: Yup.string().required('Estimated duration is required'),
      categories: Yup.array()
        .required('This field is required')
        .min(1, 'At least one category must be selected'),
      skills: Yup.array()
        .of(Yup.string())
        .when('categories', (_, schema) => {
          return selectedCategories && selectedCategories.length > 0
            ? schema
                .min(1, 'At least one skill must be selected')
                .required('This field is required')
            : schema.notRequired()
        }),
      jobTypes: Yup.array()
        .min(1, 'At least one Job Type must be selected')
        .required('This field is required'),

      location: Yup.array().when('isRemote', (_, schema) => {
        return !isRemoteJob
          ? schema
              .min(1, 'At least one country must be selected')
              .required('This field is required')
          : schema.notRequired()
      }),
    })
  }, [selectedCategories, isRemoteJob])

  useEffect(() => {
    const skills: string[] = selectedCategories.flatMap(
      category => categoriesSkills[category] || []
    )
    setAvailableSkills(skills)
  }, [selectedCategories])

  const handleSelectionChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log('Form Values', values)
      }}
    >
      {({ values, setFieldValue, errors, touched }: FormikProps<any>) => {
        console.log('Errors', errors)
        console.log({ values })
        console.log('Categoris Length', categories.length)

        return (
          <Form>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Field name="jobTitle">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="Job Title"
                    variant="outlined"
                    fullWidth
                    multiline
                    inputProps={{ maxLength: 800 }}
                    helperText={<ErrorMessage name={field.name} />}
                    error={!!errors[field.name]}
                  />
                )}
              </Field>

              <Field name="jobDescription">
                {({ field }: FieldProps) => (
                  <TextField
                    {...field}
                    label="Job Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 2000 }}
                    helperText={<ErrorMessage name={field.name} />}
                    error={!!errors[field.name]}
                  />
                )}
              </Field>

              <Field name="jobType">
                {({ field }: FieldProps) => (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Job Type</FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      onChange={e => setFieldValue('jobType', e.target.value)}
                    >
                      <FormControlLabel value="fixed" control={<Radio />} label="Fixed Cost" />
                      <FormControlLabel value="hourly" control={<Radio />} label="Hourly" />
                    </RadioGroup>
                    <ErrorMessage name="jobType" />
                  </FormControl>
                )}
              </Field>

              {values.jobType === 'fixed' ? (
                <Field name="costRange">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Fixed Cost"
                      variant="outlined"
                      fullWidth
                      type="number"
                      helperText={<ErrorMessage name={field.name} />}
                      error={!!errors[field.name]}
                    />
                  )}
                </Field>
              ) : (
                <Field name="costRange">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Hourly Rate"
                      variant="outlined"
                      fullWidth
                      type="number"
                      helperText={<ErrorMessage name={field.name} />}
                      error={!!errors[field.name]}
                    />
                  )}
                </Field>
              )}

              <Field name="estimatedDuration">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!form.errors.estimatedDuration && !!form.touched.estimatedDuration}
                  >
                    <InputLabel>Estimated Duration</InputLabel>
                    <Select {...field} label="Estimated Duration">
                      <MenuItem value="Less than 1 week">Less than 1 week</MenuItem>
                      <MenuItem value="1-4 weeks">1-4 weeks</MenuItem>
                      <MenuItem value="1-3 months">1-3 months</MenuItem>
                      <MenuItem value="3-6 months">3-6 months</MenuItem>
                      <MenuItem value="More than 6 months">More than 6 months</MenuItem>
                    </Select>
                    {form.touched.estimatedDuration &&
                      form.errors.estimatedDuration &&
                      typeof form.errors.estimatedDuration === 'string' && (
                        <FormHelperText>{form.errors.estimatedDuration}</FormHelperText>
                      )}
                  </FormControl>
                )}
              </Field>

              <Field name="categories">
                {({ field }: FieldProps) => (
                  <FormControl fullWidth error={touched.categories && !!errors.categories}>
                    <MultipleSelectCheckmarks
                      {...field}
                      data={categories}
                      label={'Select Category'}
                      onSelectionChange={value => {
                        handleSelectionChange(value)
                        setFieldValue('categories', value)
                      }}
                      error={!!errors[field.name]}
                      errorMessage={errors[field.name]?.toString() || ''}
                    />
                    <FormHelperText>
                      <ErrorMessage name="categories" />
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>

              <Field name="skills">
                {({ field }: FieldProps) => (
                  <FormControl
                    fullWidth
                    error={selectedCategories.length > 0 && touched.skills && !!errors.skills}
                  >
                    <FormLabel component="legend">Skills</FormLabel>
                    <Autocomplete
                      {...field}
                      multiple
                      disabled={selectedCategories.length === 0}
                      id="tags-filled"
                      options={availableSkills}
                      freeSolo
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      onChange={(_, newValue: string[]) => {
                        setFieldValue('skills', newValue)
                      }}
                      renderInput={params => (
                        <TextField {...params} variant="filled" placeholder="Skills" />
                      )}
                    />
                    <FormHelperText>
                      <ErrorMessage name="skills" />
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>

              <Field name="jobTypes">
                {({ field }: FieldProps) => (
                  <FormControl fullWidth error={touched.jobTypes && !!errors.jobTypes}>
                    <MultipleSelectCheckmarks
                      {...field}
                      data={jobType}
                      label={'Select Job Type'}
                      onSelectionChange={value => {
                        setFieldValue('jobTypes', value)
                      }}
                      error={!!errors[field.name]}
                      errorMessage={errors[field.name]?.toString() || ''}
                    />
                    <FormHelperText>
                      <ErrorMessage name="jobTypes" />
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Field name="location">
                    {({ field }: FieldProps) => (
                      <FormControl fullWidth error={touched.location && !!errors.location}>
                        <MultipleSelectCheckmarks
                          {...field}
                          isDisabled={isRemoteJob}
                          data={countries.map(country => country.name)}
                          label={'Select Country'}
                          onSelectionChange={value => {
                            setFieldValue('location', value)
                            if (isRemoteJob) {
                              setIsRemoteJob(false)
                            }
                          }}
                          error={!!errors[field.name]}
                          errorMessage={errors[field.name]?.toString() || ''}
                        />
                        <FormHelperText>
                          <ErrorMessage name="location" />
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field name="isRemote">
                    {({ field }: FieldProps) => (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={isRemoteJob}
                              onChange={() => {
                                setIsRemoteJob(!isRemoteJob)
                                setFieldValue('isRemote', !isRemoteJob)
                              }}
                            />
                          }
                          label="Remote"
                        />
                      </FormGroup>
                    )}
                  </Field>
                </Grid>
              </Grid>

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

export default JobPostForm
