import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import { Alert, Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
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
      }}
    >
      <CardHeader title={appointment.title} subheader={`Appointment for:  ${userName}`} />
      <CardContent>
        <ReactMarkdown>{new Date(appointment.startTime).toDateString()}</ReactMarkdown>
      </CardContent>
      {isUserSessionValid && isAppointUsers && (
        <CardActions>
          <Button onClick={() => Router.push('/a/[id]', `/a/${appointment.id}`)}>Edit</Button>
          <Button onClick={handleDeleteAppointment}>Delete</Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AppointmentProps;
