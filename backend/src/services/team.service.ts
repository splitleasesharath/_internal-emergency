import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeamMembers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ['STAFF', 'ADMIN'],
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
    orderBy: {
      fullName: 'asc',
    },
  });
};
