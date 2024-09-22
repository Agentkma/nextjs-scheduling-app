import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Appointment, { AppointmentProps } from "../components/Appointment"
import prisma from '../lib/prisma';
import { Container, Paper, Typography } from "@mui/material";



export const getStaticProps: GetStaticProps = async () => {

  const schedule = await prisma.appointment.findMany({
    include: {
      user: {
        select: { name: true },
      },
    },
  });

// Convert Date objects to strings
const serializedSchedule = schedule.map(appointment => ({
  ...appointment,
  date: appointment.date.toISOString(), // Convert Date to ISO string
}));


  return {
    props: { schedule:serializedSchedule },
    revalidate: 10,
  };
};

type Props = {
  schedule: AppointmentProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <Container>
        <Typography variant='h6'>Appointments</Typography>
        <Paper>
          {props.schedule.map((appointment) => (
              <Appointment appointment={appointment} key={appointment.id}/>
          ))}
        </Paper>
      </Container>
    </Layout>
  )
}

export default Blog
