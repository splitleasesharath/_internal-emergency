import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPresetMessages = async () => {
  return prisma.presetMessage.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      label: 'asc',
    },
  });
};

export const getPresetEmails = async () => {
  return prisma.presetEmail.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      label: 'asc',
    },
  });
};
