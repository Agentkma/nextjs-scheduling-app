import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import dayjs from 'dayjs';
import { CreateAppointmentBody } from '../..';

export default async function handle(req, res) {
  const { clientId, scheduleId, startTime, endTime }: CreateAppointmentBody = req.body;
 
  const result = await prisma.appointment.create({
    data: {
      clientId,
      scheduleId,
      startTime,
      endTime,
      expiresAt: dayjs(endTime).add(30, 'minute').toISOString(),
    },
  });
  res.json(result);
}
