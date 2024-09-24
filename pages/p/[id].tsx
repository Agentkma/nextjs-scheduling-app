import React from "react"
import { GetServerSideProps } from "next"
import ReactMarkdown from "react-markdown"
import prisma from '../../lib/prisma';
import Layout from "../../components/Layout"
import { AppointmentProps } from "../../components/Appointment"
import { Container, Typography } from "@mui/material";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
  return {
    props: { ...appointment,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString()},
  };
};

const Appointment: React.FC<AppointmentProps> = (props) => {

  return (
    <Layout>
      <Container>
        <Typography variant='h6'>{props.title}</Typography>
        <Typography variant='body2'>{props.content}</Typography>
        <Typography variant='body2'>{props.startTime}</Typography>
        <Typography variant='body2'>{props.endTime}</Typography>
        <ReactMarkdown children={props.content} />
      </Container>

    </Layout>
  )
}

export default Appointment
