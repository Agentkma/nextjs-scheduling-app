import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type AppointmentProps = {
  id: string;
  title: string;
  user: {
    name: string;
    email: string;
  } | null;
  content: string;
  date: string;
};

const AppointmentProps: React.FC<{ appointment: AppointmentProps }> = ({ appointment }) => {
  const userName = appointment.user ? appointment.user.name : "Unknown user";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${appointment.id}`)}>
      <h2>{appointment.title}</h2>
      <small>Appointment for:  {userName}</small>
      <ReactMarkdown children={appointment.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default AppointmentProps;
