import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

export type AppointmentProps = {
  id: string;
  title: string;
  user: {
    name: string;
    email: string;
  } | null;
  content: string;
  startTime: string;
  endTime: string;
};

async function deleteAppointment(id: string): Promise<void> {
  await fetch(`/api/appointment/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}

const AppointmentProps: React.FC<{ appointment: AppointmentProps }> = ({ appointment }) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return (
      <Alert variant="outlined" severity="info">
        Authenticating ...
      </Alert>
    );
  }
  const userName = appointment.user ? appointment.user.name : 'Unknown user';
  const isUserSessionValid = Boolean(session);

  const isAppointUsers = session?.user?.email === appointment.user?.email;

  const handleDeleteAppointment = async () => deleteAppointment(appointment.id);

  return (
    <Card
      sx={{
        '&:hover': {
          boxShadow: '1px 1px 6px #aaa',
        },
        my: 2,
      }}
    >
      <CardHeader title={appointment.title} subheader={`Appointment for:  ${userName}`} />
      <CardContent>
        <Typography>{appointment.content}</Typography>
        <Typography>Start : {new Date(appointment.startTime).toDateString()}</Typography>
        <Typography>End : {new Date(appointment.endTime).toDateString()}</Typography>
      </CardContent>
      {isUserSessionValid && isAppointUsers && (
        <CardActions>
          <Button variant="outlined" color="info" onClick={() => Router.push('/a/[id]', `/a/${appointment.id}`)}>
            Edit
          </Button>
          <Button onClick={handleDeleteAppointment} color="error">
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AppointmentProps;
