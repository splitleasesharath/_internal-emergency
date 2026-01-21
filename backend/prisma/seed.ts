import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@splitlease.com' },
    update: {},
    create: {
      email: 'admin@splitlease.com',
      fullName: 'Admin User',
      phoneNumber: '+1234567890',
      role: 'ADMIN',
    },
  });

  const staffUser1 = await prisma.user.upsert({
    where: { email: 'staff1@splitlease.com' },
    update: {},
    create: {
      email: 'staff1@splitlease.com',
      fullName: 'John Smith',
      phoneNumber: '+1234567891',
      role: 'STAFF',
    },
  });

  const staffUser2 = await prisma.user.upsert({
    where: { email: 'staff2@splitlease.com' },
    update: {},
    create: {
      email: 'staff2@splitlease.com',
      fullName: 'Jane Doe',
      phoneNumber: '+1234567892',
      role: 'STAFF',
    },
  });

  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      fullName: 'Alice Johnson',
      phoneNumber: '+1234567893',
      role: 'GUEST',
    },
  });

  const hostUser = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      fullName: 'Bob Williams',
      phoneNumber: '+1234567894',
      role: 'HOST',
    },
  });

  // Create sample listing
  const listing = await prisma.listing.create({
    data: {
      address: '123 Main Street, San Francisco, CA 94102',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
      hostId: hostUser.id,
    },
  });

  // Create sample reservation
  const reservation = await prisma.reservation.create({
    data: {
      agreementNumber: 'AGR-2024-001',
      listingId: listing.id,
      guestId: guestUser.id,
      checkInDate: new Date('2024-01-15'),
      checkOutDate: new Date('2024-01-20'),
      status: 'CHECKED_IN',
    },
  });

  // Create sample emergency report
  const emergency = await prisma.emergencyReport.create({
    data: {
      reservationId: reservation.id,
      reportedById: guestUser.id,
      emergencyType: 'Plumbing Issue',
      description: 'Water leak in the bathroom. The sink is dripping continuously and water is pooling on the floor.',
      status: 'REPORTED',
    },
  });

  // Create preset messages
  await prisma.presetMessage.createMany({
    data: [
      {
        label: 'Emergency Received',
        content: 'We have received your emergency report and are working on it. A team member will contact you shortly.',
        category: 'acknowledgment',
      },
      {
        label: 'On The Way',
        content: 'Our team member is on the way to your location. ETA: 30 minutes.',
        category: 'status',
      },
      {
        label: 'Work Completed',
        content: 'The emergency has been resolved. Please let us know if you need any further assistance.',
        category: 'resolution',
      },
      {
        label: 'Follow Up Required',
        content: 'We need more information about the emergency. Please call us at your earliest convenience.',
        category: 'follow-up',
      },
      {
        label: 'Temporary Solution',
        content: 'We have implemented a temporary solution. A permanent fix will be scheduled within 24 hours.',
        category: 'status',
      },
    ],
  });

  // Create preset emails
  await prisma.presetEmail.createMany({
    data: [
      {
        label: 'Emergency Acknowledgment',
        subject: 'Emergency Report Received - {{AGREEMENT_NUMBER}}',
        bodyHtml: '<p>Dear {{GUEST_NAME}},</p><p>We have received your emergency report regarding {{EMERGENCY_TYPE}}. Our team is reviewing the situation and will contact you shortly.</p><p>Thank you for your patience.</p><p>Best regards,<br>Split Lease Team</p>',
        bodyText: 'Dear {{GUEST_NAME}},\n\nWe have received your emergency report regarding {{EMERGENCY_TYPE}}. Our team is reviewing the situation and will contact you shortly.\n\nThank you for your patience.\n\nBest regards,\nSplit Lease Team',
        category: 'acknowledgment',
      },
      {
        label: 'Emergency Resolved',
        subject: 'Emergency Resolved - {{AGREEMENT_NUMBER}}',
        bodyHtml: '<p>Dear {{GUEST_NAME}},</p><p>We are pleased to inform you that the emergency has been resolved. If you have any further concerns, please do not hesitate to contact us.</p><p>Best regards,<br>Split Lease Team</p>',
        bodyText: 'Dear {{GUEST_NAME}},\n\nWe are pleased to inform you that the emergency has been resolved. If you have any further concerns, please do not hesitate to contact us.\n\nBest regards,\nSplit Lease Team',
        category: 'resolution',
      },
      {
        label: 'Requesting More Information',
        subject: 'Additional Information Needed - {{AGREEMENT_NUMBER}}',
        bodyHtml: '<p>Dear {{GUEST_NAME}},</p><p>To better assist you with the reported emergency, we need some additional information. Please reply to this email or call us at your earliest convenience.</p><p>Best regards,<br>Split Lease Team</p>',
        bodyText: 'Dear {{GUEST_NAME}},\n\nTo better assist you with the reported emergency, we need some additional information. Please reply to this email or call us at your earliest convenience.\n\nBest regards,\nSplit Lease Team',
        category: 'follow-up',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 5 users (1 admin, 2 staff, 1 guest, 1 host)');
  console.log('  - 1 listing');
  console.log('  - 1 reservation');
  console.log('  - 1 emergency report');
  console.log('  - 5 preset messages');
  console.log('  - 3 preset emails');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
