import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const seedDepartments = async () => {
  const departments = [
    {
      name: 'Department of Immigration and Emigration',
      code: 'DIE101',
      description: 'Handles passport and visa services',
      address: 'Suhurupaya, Battaramulla',
      phoneNumber: '+94112345678',
      email: 'immigration@gov.lk',
      workingHours: {
        monday: '9am-5pm',
        tuesday: '9am-5pm',
        wednesday: '9am-5pm',
        thursday: '9am-5pm',
        friday: '9am-1pm',
        saturday: 'Closed',
        sunday: 'Closed'
      }
    },
    {
      name: 'Department of Motor Traffic',
      code: 'DMT102',
      description: 'Handles vehicle registration and licensing',
      address: 'Werahera, Boralesgamuwa',
      phoneNumber: '+94117654321',
      email: 'motortraffic@gov.lk',
      workingHours: {
        monday: '8:30am-4:30pm',
        tuesday: '8:30am-4:30pm',
        wednesday: '8:30am-4:30pm',
        thursday: '8:30am-4:30pm',
        friday: '8:30am-1:30pm',
        saturday: 'Closed',
        sunday: 'Closed'
      }
    }
  ];

  for (const dept of departments) {
    await prisma.department.create({
      data: dept
    });
  }
  console.log(`${departments.length} departments seeded`);
};

const seedServices = async () => {
  const immigrationDept = await prisma.department.findFirst({
    where: { code: 'DIE101' }
  });

  const motorDept = await prisma.department.findFirst({
    where: { code: 'DMT102' }
  });

  const services = [
    {
      name: 'Passport Application',
      code: 'PSP001',
      description: 'Apply for a new passport',
      departmentId: immigrationDept?.id || '',
      estimatedTime: 60,
      requiredDocuments: ['NATIONAL_ID', 'BIRTH_CERTIFICATE', 'UTILITY_BILL'],
      fee: 3000
    },
    {
      name: 'Passport Renewal',
      code: 'PSP002',
      description: 'Renew an existing passport',
      departmentId: immigrationDept?.id || '',
      estimatedTime: 45,
      requiredDocuments: ['NATIONAL_ID', 'OLD_PASSPORT'],
      fee: 2500
    },
    {
      name: 'Driver License Application',
      code: 'DLA101',
      description: 'Apply for a new driver license',
      departmentId: motorDept?.id || '',
      estimatedTime: 90,
      requiredDocuments: ['NATIONAL_ID', 'MEDICAL_CERTIFICATE'],
      fee: 1500
    }
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service
    });
  }
  console.log(`${services.length} services seeded`);
};

const seedOfficers = async () => {
  const immigrationDept = await prisma.department.findFirst({
    where: { code: 'DIE101' }
  });

  const motorDept = await prisma.department.findFirst({
    where: { code: 'DMT102' }
  });

  if (!immigrationDept || !motorDept) {
    throw new Error('Required departments not found');
  }

  const officers = [
    {
      firstName: 'Anjali',
      lastName: 'Perera',
      email: 'anjali.perera@immigration.gov.lk',
      password: 'officer123',
      employeeId: 'DIE-OFF-001',
      role: 'OFFICER' as const, // Explicitly type as const
      departmentId: immigrationDept.id
    },
    {
      firstName: 'Kamal',
      lastName: 'Silva',
      email: 'kamal.silva@immigration.gov.lk',
      password: 'officer123',
      employeeId: 'DIE-OFF-002',
      role: 'MANAGER' as const, // Explicitly type as const
      departmentId: immigrationDept.id
    },
    {
      firstName: 'Nimal',
      lastName: 'Fernando',
      email: 'nimal.fernando@motortraffic.gov.lk',
      password: 'officer123',
      employeeId: 'DMT-OFF-001',
      role: 'OFFICER' as const, // Explicitly type as const
      departmentId: motorDept.id
    }
  ];

  for (const officer of officers) {
    await prisma.officer.create({
      data: {
        ...officer,
        // Explicitly cast to satisfy Prisma's type requirements
        role: officer.role as any
      }
    });
  }
  console.log(`${officers.length} officers seeded`);
};

const seedTimeSlots = async () => {
  const departments = await prisma.department.findMany();
  const timeSlots = [];

  // Create time slots for next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    for (const dept of departments) {
      // Create 5 time slots per day per department
      for (let j = 0; j < 5; j++) {
        const startHour = 9 + j; // 9am, 10am, 11am, etc.
        
        timeSlots.push({
          departmentId: dept.id,
          date: date,
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour + 1),
          maxBookings: 5,
          currentBookings: 0
        });
      }
    }
  }

  for (const slot of timeSlots) {
    await prisma.timeSlot.create({
      data: slot
    });
  }
  console.log(`${timeSlots.length} time slots seeded`);
};



const seedAppointments = async () => {
  const users = await prisma.user.findMany();
  const services = await prisma.service.findMany();
  const timeSlots = await prisma.timeSlot.findMany();
  const officers = await prisma.officer.findMany();

  const appointments = [];

  // Create appointment for Janith
  const janith = users.find(u => u.email === 'janith@example.com');
  const passportService = services.find(s => s.code === 'PSP001');
  const timeSlot = timeSlots.find(
    ts => ts.startTime.getHours() === 9 && 
          ts.startTime.getDate() === new Date().getDate() + 3
  );
  const officerAnjali = officers.find(o => o.employeeId === 'DIE-OFF-001');

  if (janith && passportService && timeSlot && officerAnjali) {
    appointments.push({
      bookingReference: `A${faker.string.numeric(9)}`,
      qrCode: faker.string.uuid(),
      userId: janith.id,
      serviceId: passportService.id,
      timeSlotId: timeSlot.id,
      officerId: officerAnjali.id,
      status: 'CONFIRMED',
      appointmentDate: timeSlot.startTime
    });
  }

  // Create random appointments
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const service = faker.helpers.arrayElement(services);
    const slot = faker.helpers.arrayElement(
      timeSlots.filter(ts => 
        ts.departmentId === service.departmentId &&
        ts.date > new Date()
      )
    );
    const officer = faker.helpers.arrayElement(
      officers.filter(o => o.departmentId === service.departmentId)
    );

    if (slot) {
      appointments.push({
        bookingReference: `A${faker.string.numeric(9)}`,
        qrCode: faker.string.uuid(),
        userId: user.id,
        serviceId: service.id,
        timeSlotId: slot.id,
        officerId: officer?.id,
        status: faker.helpers.arrayElement([
          'PENDING', 'CONFIRMED', 'COMPLETED'
        ]) as any,
        appointmentDate: slot.startTime
      });
    }
  }

  for (const appt of appointments) {
    await prisma.appointment.create({
      data: appt
    });
  }
  console.log(`${appointments.length} appointments seeded`);
};



const seedFeedback = async () => {
  const completedAppointments = await prisma.appointment.findMany({
    where: { status: 'COMPLETED' },
    include: { user: true }
  });

  for (const appt of completedAppointments) {
    await prisma.feedback.create({
      data: {
        userId: appt.userId,
        appointmentId: appt.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        isAnonymous: faker.datatype.boolean()
      }
    });
  }
  console.log(`${completedAppointments.length} feedback entries seeded`);
};




const seedUsers = async () => {
  // Create 10 users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: '11111111',
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        nationalId: faker.string.uuid(),
        dateOfBirth: faker.date.past(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.location.state(),
        postalCode: faker.location.zipCode(),
        isVerified: faker.datatype.boolean(),
      },
    });
  }
  console.log(`10 users have been seeded`);
};

const main = async () => {
  await seedUsers();
  await seedDepartments();
  await seedServices();
  await seedOfficers();
  await seedTimeSlots();
  
  console.log('Seeding completed successfully');
  await prisma.$disconnect();
};

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
