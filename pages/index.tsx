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


const serializedSchedule = schedule.map(appointment => ({
  ...appointment,
  startTime: appointment.startTime.toISOString(), 
  endTime: appointment.endTime.toISOString()
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
        <Typography variant='h6' sx={{my:2}}>Appointments</Typography>
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
