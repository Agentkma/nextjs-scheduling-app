// import React from 'react';
// import { GetServerSideProps } from 'next';
// import prisma from '../../lib/prisma';
// import Layout from '../../components/Layout';
// import { AppointmentProps } from '../../components/Appointment';
// import Form from '../../components/Form';

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const appointment = await prisma.appointment.findUnique({
//     where: {
//       id: String(params?.id),
//     },
//     include: {
//       user: {
//         select: { name: true, email: true },
//       },
//     },
//   });
//   return {
//     props: {
//       ...appointment,
//       startTime: appointment.startTime.toISOString(),
//       endTime: appointment.endTime.toISOString(),
//     },
//   };
// };

// const Appointment: React.FC<AppointmentProps> = (props) => {
//   return (
//     <Layout>
//       <Form
//         initialValues={{
//           title: props.title,
//           content: props.content,
//           startTime: props.startTime,
//           endTime: props.endTime,
//           id: props.id,
//         }}
//       />
//     </Layout>
//   );
// };

// export default Appointment;
