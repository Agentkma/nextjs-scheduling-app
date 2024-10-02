import React, { useMemo } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Appointment, { AppointmentProps } from '../components/Appointment';
import prisma from '../lib/prisma';
import {
  Alert,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { getSession, useSession } from 'next-auth/react';
import TimeWindow from '../ui/TimeWindow';

export type CreateAppointmentBody = {
  clientId: string;
  scheduleId: number;
  startTime: string;
  endTime: string;
  timeWindowId: number;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { appointments: [] } };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      client: { email: session.user.email },
    },
    include: {
      client: {
        select: { name: true, email: true },
      },
      schedule: {
        select: {
          startTime: true,
          endTime: true,

          provider: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const providersWithDetails = await prisma.user.findMany({
    where: {
      userRole: 'PROVIDER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      appointments: true,
      schedules: {
        select: {
          id: true,
          timeWindows: true,
        },
      },
    },
  });

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return {
    props: {
      currentUser,
      appointments: appointments.map((a) => ({
        ...a,
        startTime: a.startTime.toISOString(),
        endTime: a.endTime.toISOString(),
      })),
      providers: providersWithDetails.map((p) => ({
        ...p,
        schedules: p.schedules.map((s) => ({
          ...s,
          timeWindows: s.timeWindows.map((tw) => ({
            ...tw,
            startTime: tw.startTime.toISOString(),
            endTime: tw.endTime.toISOString(),
          })),
        })),
        appointments: p.appointments.map((a) => ({
          ...a,
          startTime: a.startTime.toISOString(),
          endTime: a.endTime.toISOString(),
        })),
      })),
    },
  };
};

type Provider = {
  id: string;
  name: string;
  email: string;
  schedules: {
    id: number;
    timeWindows: {
      id: number;
      scheduleId: number;
      startTime: string;
      endTime: string;
      appointmentId: number | null;
    }[];
  }[];
  appointments: {
    startTime: string;
    endTime: string;
    id: number;
    clientId: string;
    scheduleId: number;
    confirmed: boolean;
    createdAt: string;
    expiresAt: string;
  }[];
};
type Props = {
  currentUser: { name: string; id: number; email: string };
  appointments: AppointmentProps[];
  providers: Provider[];
};

const Home: React.FC<Props> = ({ currentUser, appointments, providers }) => {
  const providerMap = useMemo(() => {
    const initVal: Record<string, Provider> = {};
    return providers?.reduce((accum, p) => {
      accum[p.id] = p;
      return accum;
    }, initVal);
  }, [providers]);

  const [selectedProvider, setSelectedProvider] = React.useState<Provider | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    const provider = providerMap[event.target.value];
    if (provider) {
      setSelectedProvider(provider);
    }
  };
  const handleCreateAppointment = async ({
    clientId,
    scheduleId,
    startTime,
    endTime,
    timeWindowId,
  }: CreateAppointmentBody) => {
    try {
      await fetch('/api/appointment/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          scheduleId,
          startTime,
          endTime,
          timeWindowId,
        }),
      });
    } catch (error) {
      console.warn('failed to create appointment', error);
    }
  };

  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Alert>Authenticating...</Alert>;
  }

  if (session) {
    return (
      <Layout>
        <Typography variant="h6" sx={{ my: 2 }}>
          Appointments
        </Typography>
        {!appointments.length && (
          <Alert severity="info" sx={{ my: 2 }}>
            No appointments yet.
          </Alert>
        )}
        {appointments.map((appointment) => (
          <Appointment appointment={appointment} key={appointment.id} />
        ))}
        <Divider />
        <Typography variant="h6" sx={{ my: 2 }}>
          Schedule
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="select-label-provider">Provider</InputLabel>
            <Select
              labelId="select-label-provider"
              id="select-label-provider"
              value={selectedProvider?.id ?? ''}
              label="Provider"
              onChange={handleChange}
            >
              {providers.map((p) => (
                <MenuItem value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedProvider &&
            selectedProvider.schedules.map((s) =>
              s.timeWindows.reduce((accum, tw) => {
                if (!tw.appointmentId) {
                  accum.push(
                    <TimeWindow
                      key={tw.id}
                      startTime={tw.startTime}
                      endTime={tw.endTime}
                      provider={{ name: selectedProvider.name }}
                      buttonProps={{
                        onClick: () =>
                          handleCreateAppointment({
                            clientId: currentUser.id.toString(),
                            scheduleId: tw.scheduleId,
                            startTime: tw.startTime,
                            endTime: tw.endTime,
                            timeWindowId: tw.id,
                          }),
                        name: 'Reserve',
                      }}
                      scheduleId={s.id}
                    />,
                  );
                }
                return accum;
              }, []),
            )}
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack
        sx={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1" sx={{ my: 2 }}>
          Let's Schedule .....Pal!
        </Typography>
        <Typography variant="h6" sx={{ my: 2 }}>
          Login to begin.
        </Typography>
      </Stack>
    </Layout>
  );
};

export default Home;
