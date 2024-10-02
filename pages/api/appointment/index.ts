import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import dayjs from 'dayjs';
import { CreateAppointmentBody } from '../..';

export default async function handle(req, res) {
  const { clientId, scheduleId, startTime, endTime, timeWindowId }: CreateAppointmentBody = req.body;
  const data = {
    clientId,
    scheduleId,
    startTime,
    endTime,
    expiresAt: dayjs(endTime).add(30, 'minute').toISOString(),
  };
  await prisma.$transaction(async (prisma) => {
    const newAppointment = await prisma.appointment.create({
      data,
    });
    res.json(newAppointment);

    await prisma.schedule.update({
      where: { id: data.scheduleId },
      data: {
        timeWindows: {
          update: {
            where: { id: timeWindowId },
            data: { appointmentId: newAppointment.id },
          },
        },
      },
    });
  });
}
