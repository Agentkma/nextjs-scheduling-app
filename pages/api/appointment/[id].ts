import prisma from '../../../lib/prisma';

// TODO: add logic to delete appointment if not confirmed within 30 minutes after creation
export default async function handle(req, res) {
  const appointment = req.query.id;
  if (req.method === 'DELETE') {
    const a = await prisma.appointment.delete({
      where: { id: appointment.id },
    });
    res.json(a);
  }

  if (req.method === 'PUT') {
    const a = await prisma.appointment.update({
      where: { id: appointment.id },
      data: req.body,
    });
    res.json(a);
  }

  throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
}
