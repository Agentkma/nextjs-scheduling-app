import React, { useState } from 'react';
import Router from 'next/router';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AppointmentProps } from './Appointment';
import { object, string, InferType } from 'yup';
import { useFormik } from 'formik';

//!FIXME: schema needs to be dynamic so we can check start/end times
const schema = object({
  title: string().required(),
  content: string().required(),
  startTime: string().required(),
  endTime: string().required(),
});
type FormValues = InferType<typeof schema>;
const BasicDateTimePicker = ({
  label,
  isDisabled,
  onChange,
  value,
  minDateTime,
}: {
  label: string;
  onChange: DateTimePickerProps<Dayjs>['onChange'];
  isDisabled?: boolean;
  value: Dayjs;
  minDateTime?: Dayjs;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        disablePast
        disabled={isDisabled}
        onChange={onChange}
        value={value}
        minDateTime={minDateTime}
      />
    </LocalizationProvider>
  );
};
type FormProps = {
  initialValues?: Pick<AppointmentProps, 'title' | 'content' | 'startTime' | 'endTime' | 'id'>;
};
const getInitialValues = (initialValues?: FormProps['initialValues']) =>
  initialValues ?? {
    title: '',
    content: '',
    startTime: null,
    endTime: null,
  };
const Form: React.FC<FormProps> = ({ initialValues }) => {
  // const [title, setTitle] = useState(initialValues?.title ?? '');
  // const [content, setContent] = useState(initialValues?.content ?? '');
  // const [startTime, setStartTime] = useState<Dayjs | null>(
  //   initialValues?.startTime ? dayjs(initialValues.startTime) : null,
  // );
  // const [endTime, setEndTime] = useState<Dayjs | null>(initialValues?.endTime ? dayjs(initialValues.endTime) : null);

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
      // !FIXME show user error
      console.error(error);
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
        {`${initialValues ? 'Edit' : 'New'} Appointment`}
      </Typography>
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
          />
        </Grid2>
        <Grid2 size={8} container spacing={2}>
          <BasicDateTimePicker label="Start Time" onChange={handleStartTimeChange} value={formik.values.startTime} />{' '}
          <BasicDateTimePicker
            label="End Time"
            onChange={handleEndTimeChange}
            isDisabled={!formik.values.startTime}
            value={formik.values.endTime}
            minDateTime={formik.values.startTime?.add(15, 'minute')}
          />
        </Grid2>
        <Grid2 size={8} container spacing={2}>
          <Button disabled={!formik.isValid} type="submit" variant="outlined" color="success">
            {initialValues ? 'Create' : 'Save'}
          </Button>
          <Button href="#" onClick={() => Router.push('/')} color="error">
            Cancel
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};

export default Form;
