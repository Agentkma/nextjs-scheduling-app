import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import dayjs from 'dayjs';

export default async function handle(req, res) {
  const { clientId, scheduleId, startTime, endTime, schedule } = req.body;

  const session = await getServerSession(req, res, options);

  // startTime: Date | string;
  // endTime: Date | string;
  // confirmed?: boolean;
  // createdAt?: Date | string;
  // expiresAt: Date | string;
  // client: UserCreateNestedOneWithoutAppointmentsInput;
  // schedule: ScheduleCreateNestedOneWithoutAppointmentsInput;
  // timeWindows?: TimeWindowCreateNestedManyWithoutAppointmentInput;
  // !FIXME: typing not correct from request
  const result = await prisma.appointment.create({
    data: {
      // clientId,
      scheduleId,
      startTime,
      endTime,
      expiresAt: dayjs(endTime).add(30, 'minute').toISOString(),
      client: { connect: { email: session?.user?.email } },
      schedule,
    },
  });
  res.json(result);
}
