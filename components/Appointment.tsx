import React from 'react';
import Router from 'next/router';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

export type AppointmentProps = {
  startTime: string;
  endTime: string;
  client: {
    name: string;
    email: string;
  };
  schedule: {
    startTime: Date;
    endTime: Date;
    provider: {
      name: string;
    };
  };
  id: number;
  clientId: string;
  scheduleId: number;
  confirmed: boolean;
  createdAt: Date;
  expiresAt: Date;
};

async function patchAppointment({
  id,
  ...body
}: Partial<Omit<AppointmentProps, 'schedule' | 'client'>>): Promise<void> {
  await fetch(`/api/appointment/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  // Router.push('/');
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
  const providerName = appointment.schedule.provider.name ? appointment.client.name : 'Unknown user';
  const isUserSessionValid = Boolean(session);

  const isAppointUsers = session?.user?.email === appointment.client?.email;

  const handleConfirmAppointment = async () => {
    patchAppointment({ id: appointment.id, confirmed: true });
  };

  //!FIXME: use TimeWindow to here?  or should Appointment be modified to be used for TimeWindows

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
          {/* <Button variant="outlined" color="info" onClick={() => Router.push('/a/[id]', `/a/${appointment.id}`)}>
            Edit
          </Button> */}
          <Button onClick={handleConfirmAppointment} color="error">
            Confirm
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AppointmentProps;
