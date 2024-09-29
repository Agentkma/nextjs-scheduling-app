import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Appointment, { AppointmentProps } from '../components/Appointment';
import prisma from '../lib/prisma';
import { Alert, Typography } from '@mui/material';
import { getSession, useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { appointments: [] } };
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      user: { email: session.user.email },
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: {
      appointments: appointments.map((a) => ({
        ...a,
        startTime: a.startTime.toISOString(),
        endTime: a.endTime.toISOString(),
      })),
    },
  };
};

type Props = {
  appointments: AppointmentProps[];
};

const Home: React.FC<Props> = (props) => {
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

        {props.appointments.map((appointment) => (
          <Appointment appointment={appointment} key={appointment.id} />
        ))}
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h6" sx={{ my: 2 }}>
        Let's Schedule .....Pal!
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        Login to begin.
      </Typography>
    </Layout>
  );
};

export default Home;
