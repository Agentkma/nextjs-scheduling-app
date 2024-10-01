import React from 'react';

import { Alert } from '@mui/material';
import { useSession } from 'next-auth/react';
import TimeWindow from '../ui/TimeWindow';

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

  const isUserSessionValid = Boolean(session);

  const isUsersAppointment = session?.user?.email === appointment.client?.email;

  if (!isUsersAppointment) {
    return null;
  }

  const handleConfirmAppointment = async () => {
    if (isUserSessionValid) {
      patchAppointment({ id: appointment.id, confirmed: true });
    }
  };

  return (
    <TimeWindow
      subheader={<>{`Appointment for:  ${appointment.client.name}`}</>}
      startTime={appointment.startTime}
      endTime={appointment.endTime}
      provider={{ name: appointment.schedule.provider.name }}
      {...(!appointment.confirmed && {
        buttonProps: {
          onClick: handleConfirmAppointment,
          name: 'Reserve',
        },
      })}
      scheduleId={appointment.scheduleId}
    />
  );
};

export default AppointmentProps;
