import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Appointment, { AppointmentProps } from "../components/Appointment"
import prisma from '../lib/prisma';



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
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.schedule.map((appointment) => (
            <div key={appointment.id} className="post">
              <Appointment appointment={appointment} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
