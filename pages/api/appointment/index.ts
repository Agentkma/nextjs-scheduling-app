import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';


export default async function handle(req, res) {
  const { title, content,startTime,endTime } = req.body;

  const session = await getSession({ req })
  // !FIXME: session 
//   [next-auth][error][CLIENT_FETCH_ERROR] 
// https://next-auth.js.org/errors#client_fetch_error undefined {
//   error: {},
//   url: 'http://localhost:3000/api/auth/session',
//   message: undefined
// }
// session null
  console.log('session', session)
  const result = await prisma.appointment.create({
    data: {
      title,
      content,
      startTime,
      endTime,
      user: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}