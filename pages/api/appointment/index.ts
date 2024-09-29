import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { title, content, startTime, endTime } = req.body;

  const session = await getServerSession(req, res, options);

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
