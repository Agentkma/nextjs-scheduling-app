import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader,  } from "@mui/material";

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

const AppointmentProps: React.FC<{ appointment: AppointmentProps }> = ({ appointment }) => {
  const userName = appointment.user ? appointment.user.name : "Unknown user";
  return (
    <Card onClick={() => Router.push("/p/[id]", `/p/${appointment.id}`)}   sx={{
      '&:hover': {
        cursor: 'pointer',
        boxShadow: '1px 1px 6px #aaa', 
      },
    }}
  >
      <CardHeader title={appointment.title} subheader={`Appointment for:  ${userName}`}/>
      <CardContent>  
        <ReactMarkdown children={new Date(appointment.startTime).toDateString()} />
      </CardContent>
    </Card>
  );
};

export default AppointmentProps;
