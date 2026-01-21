import { PrismaClient, EmergencyStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface EmergencyFilters {
  status?: string;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}

interface CreateEmergencyData {
  reservationId: string;
  reportedById: string;
  emergencyType: string;
  description: string;
  photo1Url?: string;
  photo2Url?: string;
}

interface UpdateEmergencyData {
  emergencyType?: string;
  description?: string;
  guidanceInstructions?: string;
  status?: EmergencyStatus;
}

export const getAllEmergencies = async (filters: EmergencyFilters) => {
  const { status, assignedTo, limit = 50, offset = 0 } = filters;

  const where: any = {
    isHidden: false,
  };

  if (status) {
    where.status = status;
  }

  if (assignedTo) {
    where.assignedToId = assignedTo;
  }

  const [emergencies, total] = await Promise.all([
    prisma.emergencyReport.findMany({
      where,
      include: {
        reservation: {
          include: {
            listing: true,
            guest: true,
          },
        },
        reportedBy: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.emergencyReport.count({ where }),
  ]);

  return {
    data: emergencies,
    total,
    limit,
    offset,
  };
};

export const getEmergencyById = async (id: string) => {
  return prisma.emergencyReport.findUnique({
    where: { id },
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
      assignedTo: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      emails: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
};

export const createEmergency = async (data: CreateEmergencyData) => {
  return prisma.emergencyReport.create({
    data: {
      ...data,
      status: 'REPORTED',
    },
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
    },
  });
};

export const updateEmergency = async (id: string, data: UpdateEmergencyData) => {
  return prisma.emergencyReport.update({
    where: { id },
    data,
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
      assignedTo: true,
    },
  });
};

export const assignEmergency = async (
  id: string,
  assignedToId: string,
  guidanceInstructions?: string
) => {
  return prisma.emergencyReport.update({
    where: { id },
    data: {
      assignedToId,
      assignedAt: new Date(),
      status: 'ASSIGNED',
      guidanceInstructions,
    },
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
      assignedTo: true,
    },
  });
};

export const updateStatus = async (id: string, status: EmergencyStatus) => {
  const data: any = { status };

  if (status === 'RESOLVED') {
    data.resolvedAt = new Date();
  }

  return prisma.emergencyReport.update({
    where: { id },
    data,
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
      assignedTo: true,
    },
  });
};

export const updateVisibility = async (id: string, isHidden: boolean) => {
  return prisma.emergencyReport.update({
    where: { id },
    data: { isHidden },
  });
};

export const getEmergencyByAgreementNumber = async (agreementNumber: string) => {
  return prisma.emergencyReport.findMany({
    where: {
      reservation: {
        agreementNumber,
      },
    },
    include: {
      reservation: {
        include: {
          listing: true,
          guest: true,
        },
      },
      reportedBy: true,
      assignedTo: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
