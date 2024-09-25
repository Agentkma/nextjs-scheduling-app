import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { Button, Grid2, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AppointmentProps } from './Appointment';

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
const Form: React.FC<FormProps> = ({ initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(initialValues?.startTime) ?? null);
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(initialValues?.endTime) ?? null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, startTime, endTime };

      if (initialValues) {
        await fetch(`/api/appointment/${initialValues.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        await Router.push('/');

        return;
      }
      await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartTimeChange: DateTimePickerProps<Dayjs>['onChange'] = (value) => {
    setStartTime(value);

    const fifteenMinutesBeforeEndTime = endTime?.subtract(15, 'minute');
    if (endTime && value.isAfter(fifteenMinutesBeforeEndTime)) {
      setEndTime(null);
    }
  };
  const handleEndTimeChange: DateTimePickerProps<Dayjs>['onChange'] = (value) => {
    setEndTime(value);
  };

  const isFormValid = startTime && endTime && title && content;

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ my: 2 }}>
          {`${initialValues ? 'New' : 'Edit'} Appointment`}
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={8}>
            <TextField
              fullWidth
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
            />
          </Grid2>
          <Grid2 size={8}>
            <TextField
              fullWidth
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={8}
              value={content}
              multiline
            />
          </Grid2>
          <Grid2 size={8} container spacing={2}>
            <BasicDateTimePicker label="Start Time" onChange={handleStartTimeChange} value={startTime} />{' '}
            <BasicDateTimePicker
              label="End Time"
              onChange={handleEndTimeChange}
              isDisabled={!startTime}
              value={endTime}
              minDateTime={startTime?.add(15, 'minute')}
            />
          </Grid2>
          <Grid2 size={8} container spacing={2}>
            <Button disabled={!isFormValid} type="submit" variant="outlined" color="success">
              {initialValues ? 'Create' : 'Save'}
            </Button>
            <Button href="#" onClick={() => Router.push('/')} color="error">
              Cancel
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Layout>
  );
};

export default Form;
