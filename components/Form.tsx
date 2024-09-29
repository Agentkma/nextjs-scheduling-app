import React, { useState } from 'react';
import Router from 'next/router';
import { Alert, Button, Grid2, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AppointmentProps } from './Appointment';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';

const schema = object({
  title: string().required(),
  content: string().required(),
  startTime: string().required(),
  endTime: string().required(),
});

const errorMessageMap = {
  minDate: 'Please select a later date',
  minTime: 'Please select a later time',
  disablePast: 'Please select a time in the future',
};

type FormProps = {
  initialValues?: Pick<AppointmentProps, 'title' | 'content' | 'id' | 'startTime' | 'endTime'>;
};

type FormValues = Pick<AppointmentProps, 'title' | 'content'> & {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
};
const getInitialValues = (initialValues?: FormProps['initialValues']) =>
  initialValues
    ? {
        ...initialValues,
        startTime: dayjs(initialValues.startTime),
        endTime: dayjs(initialValues.endTime),
      }
    : {
        title: '',
        content: '',
        startTime: null,
        endTime: null,
      };

const Form: React.FC<FormProps> = ({ initialValues }) => {
  const [dateValidationMessage, setDateValidationMessage] = useState<{ startTime: string; endTime: string }>({
    startTime: '',
    endTime: '',
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (formValues: FormValues) => {
    try {
      if (initialValues) {
        await fetch(`/api/appointment/${initialValues.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues),
        });
        await Router.push('/');

        return;
      }

      await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      await Router.push('/');
    } catch (error) {
      setSaveError('There was an error saving the appointment.');
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(initialValues),
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  const handleStartTimeChange: DateTimePickerProps<Dayjs>['onChange'] = (value) => {
    formik.setFieldValue('startTime', value);

    const fifteenMinutesBeforeEndTime = formik.values.endTime?.subtract(15, 'minute');
    if (formik.values.endTime && value.isAfter(fifteenMinutesBeforeEndTime)) {
      formik.setFieldValue('endTime', null);
    }
  };
  const handleEndTimeChange: DateTimePickerProps<Dayjs>['onChange'] = (value) => {
    formik.setFieldValue('endTime', value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {`${initialValues ? 'Edit' : 'Add'} Appointment`}
      </Typography>
      {saveError && <Alert severity="error">{saveError}</Alert>}
      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <TextField
            fullWidth
            autoFocus
            name="title"
            onChange={formik.handleChange}
            placeholder="Title"
            type="text"
            value={formik.values.title}
            helperText={formik.touched.title && formik.errors.title}
            error={!!formik.touched.title && !!formik.errors.title}
          />
        </Grid2>
        <Grid2 size={8}>
          <TextField
            fullWidth
            onChange={formik.handleChange}
            placeholder="Content"
            rows={8}
            value={formik.values.content}
            multiline
            name="content"
            helperText={formik.errors.content}
            error={!!formik.touched.content && !!formik.errors.content}
          />
        </Grid2>
        <Grid2 size={8} container spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Time"
              disablePast
              onChange={handleStartTimeChange}
              value={formik.values.startTime}
              slotProps={{
                textField: {
                  helperText: dateValidationMessage.startTime || formik.errors.startTime || '',
                  error: !!dateValidationMessage.startTime || !!(formik.touched.startTime && formik.errors.startTime),
                },
              }}
              onError={(newError) =>
                setDateValidationMessage((prevState) => ({
                  ...prevState,
                  startTime: errorMessageMap?.[newError] ?? newError,
                }))
              }
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="End Time"
              disablePast
              disabled={!formik.values.startTime}
              onChange={handleEndTimeChange}
              value={formik.values.endTime}
              minDateTime={formik.values.startTime?.add(15, 'minute')}
              slotProps={{
                textField: {
                  helperText: dateValidationMessage.endTime || (formik.touched.endTime && formik.errors.endTime) || '',
                  error: !!dateValidationMessage.endTime || !!(formik.touched.endTime && formik.errors.endTime),
                },
              }}
              onError={(newError) =>
                setDateValidationMessage((prevState) => ({
                  ...prevState,
                  endTime: errorMessageMap?.[newError] ?? newError,
                }))
              }
            />
          </LocalizationProvider>
        </Grid2>
        <Grid2 size={8} container spacing={2}>
          <LoadingButton
            disabled={!formik.isValid}
            loading={formik.isSubmitting}
            type="submit"
            variant="outlined"
            color="success"
          >
            {initialValues ? 'Save' : 'Create'}
          </LoadingButton>
          <Button href="#" onClick={() => Router.push('/')} color="error">
            Cancel
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};

export default Form;
