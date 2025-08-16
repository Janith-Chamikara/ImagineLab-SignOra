import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { getHashedPassword } from '../src/lib/utils';

const prisma = new PrismaClient();

const seedUsers = async () => {
  const hashedPassword = await getHashedPassword('11111111');

  // Create 10 users with Sri Lankan context
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: hashedPassword, // Use hashed password instead of plain text
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: `+94${faker.string.numeric(9)}`, // Sri Lankan phone format
        nationalId: `${faker.string.numeric(9)}V`, // Sri Lankan NIC format
        dateOfBirth: faker.date.past(),
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement([
          'Colombo',
          'Kandy',
          'Galle',
          'Jaffna',
          'Negombo',
          'Anuradhapura',
        ]), // Sri Lankan cities
        province: faker.helpers.arrayElement([
          'Western',
          'Central',
          'Southern',
          'Northern',
          'Eastern',
          'North Western',
          'North Central',
          'Uva',
          'Sabaragamuwa',
        ]), // Sri Lankan provinces
        postalCode: faker.string.numeric(5),
        isVerified: faker.datatype.boolean(),
      },
    });
  }
  console.log(`10 users have been seeded`);
};

const seedDepartments = async () => {
  const departments = [
    {
      name: 'Department of Immigration and Emigration',
      code: 'DIE',
      description:
        'Handles passport applications, visa services, and immigration matters',
      address: 'No. 41, Ananda Rajakaruna Mawatha, Colombo 10',
      phoneNumber: '+94112329000',
      email: 'info@immigration.gov.lk',
      workingHours: {
        monday: '8:30-16:30',
        tuesday: '8:30-16:30',
        wednesday: '8:30-16:30',
        thursday: '8:30-16:30',
        friday: '8:30-16:30',
        saturday: 'closed',
        sunday: 'closed',
      },
    },
    {
      name: "Registrar General's Department",
      code: 'RGD',
      description:
        'Birth, death, marriage certificates and civil registration services',
      address: 'No. 356, R.A. De Mel Mawatha, Colombo 03',
      phoneNumber: '+94112691911',
      email: 'info@rgd.gov.lk',
      workingHours: {
        monday: '8:30-16:30',
        tuesday: '8:30-16:30',
        wednesday: '8:30-16:30',
        thursday: '8:30-16:30',
        friday: '8:30-16:30',
        saturday: 'closed',
        sunday: 'closed',
      },
    },
    {
      name: 'Department of Motor Traffic',
      code: 'DMT',
      description:
        'Driving licenses, vehicle registration, and traffic-related services',
      address: 'No. 30, Narahenpita Road, Colombo 05',
      phoneNumber: '+94112368421',
      email: 'info@dmt.gov.lk',
      workingHours: {
        monday: '8:30-16:30',
        tuesday: '8:30-16:30',
        wednesday: '8:30-16:30',
        thursday: '8:30-16:30',
        friday: '8:30-16:30',
        saturday: '8:30-12:30',
        sunday: 'closed',
      },
    },
    {
      name: 'Divisional Secretariat - Colombo',
      code: 'DS-COL',
      description: 'Local administrative services, certificates, and permits',
      address: 'Divisional Secretariat Office, Colombo',
      phoneNumber: '+94112421421',
      email: 'ds.colombo@gov.lk',
      workingHours: {
        monday: '8:30-16:30',
        tuesday: '8:30-16:30',
        wednesday: '8:30-16:30',
        thursday: '8:30-16:30',
        friday: '8:30-16:30',
        saturday: 'closed',
        sunday: 'closed',
      },
    },
    {
      name: 'Department of Inland Revenue',
      code: 'DIR',
      description: 'Tax registration, returns, and revenue-related services',
      address: 'No. 5, Cyril Perera Mawatha, Colombo 02',
      phoneNumber: '+94112421200',
      email: 'info@ird.gov.lk',
      workingHours: {
        monday: '8:30-16:30',
        tuesday: '8:30-16:30',
        wednesday: '8:30-16:30',
        thursday: '8:30-16:30',
        friday: '8:30-16:30',
        saturday: 'closed',
        sunday: 'closed',
      },
    },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.create({
      data: dept,
    });
    createdDepartments.push(department);
  }

  console.log(`${departments.length} departments have been seeded`);
  return createdDepartments;
};

const seedOfficers = async (departments: any[]) => {
  const hashedPassword = await getHashedPassword('11111111');

  const sriLankanFirstNames = [
    'Nimal',
    'Sunil',
    'Kamal',
    'Priya',
    'Sandya',
    'Chamara',
    'Dilani',
    'Ruwan',
    'Madhavi',
    'Thilaka',
  ];
  const sriLankanLastNames = [
    'Perera',
    'Silva',
    'Fernando',
    'Jayawardena',
    'Wickramasinghe',
    'Gunasekara',
    'Rajapaksa',
    'Mendis',
    'Amarasinghe',
    'Dissanayake',
  ];

  await prisma.officer.create({
    data: {
      email: 'admin@gov.lk',
      password: hashedPassword, // Use hashed password instead of plain text
      firstName: 'System',
      lastName: 'Administrator',
      employeeId: 'SYS-ADM-0001',
      role: 'ADMIN',
      departmentId: departments[0].id, // Assign to first department for now
    },
  });

  for (const department of departments) {
    // Create 1 admin and 2-3 officers per department
    await prisma.officer.create({
      data: {
        email: `admin.${department.code.toLowerCase()}@gov.lk`,
        password: hashedPassword, // Use hashed password instead of plain text
        firstName: faker.helpers.arrayElement(sriLankanFirstNames),
        lastName: faker.helpers.arrayElement(sriLankanLastNames),
        employeeId: `${department.code}-ADM-${faker.string.numeric(4)}`,
        role: 'ADMIN',
        departmentId: department.id,
      },
    });

    const numOfficers = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < numOfficers; i++) {
      await prisma.officer.create({
        data: {
          email: `officer${i + 1}.${department.code.toLowerCase()}@gov.lk`,
          password: hashedPassword, // Use hashed password instead of plain text
          firstName: faker.helpers.arrayElement(sriLankanFirstNames),
          lastName: faker.helpers.arrayElement(sriLankanLastNames),
          employeeId: `${department.code}-OFF-${faker.string.numeric(4)}`,
          role: 'OFFICER',
          departmentId: department.id,
        },
      });
    }
  }

  console.log(`Officers have been seeded for all departments`);
};

const seedServices = async (departments: any[]) => {
  const servicesByDepartment = {
    DIE: [
      {
        name: 'New Passport Application',
        code: 'PASS-NEW',
        description: 'Apply for a new Sri Lankan passport',
        estimatedTime: 60,
        requiredDocuments: ['NATIONAL_ID', 'BIRTH_CERTIFICATE', 'UTILITY_BILL'],
        fee: 3500.0,
      },
      {
        name: 'Passport Renewal',
        code: 'PASS-REN',
        description: 'Renew existing Sri Lankan passport',
        estimatedTime: 45,
        requiredDocuments: ['PASSPORT', 'NATIONAL_ID'],
        fee: 3500.0,
      },
      {
        name: 'Emergency Travel Document',
        code: 'ETD',
        description: 'Emergency travel document for urgent travel',
        estimatedTime: 30,
        requiredDocuments: ['NATIONAL_ID', 'UTILITY_BILL'],
        fee: 5000.0,
      },
    ],
    RGD: [
      {
        name: 'Birth Certificate',
        code: 'BIRTH-CERT',
        description: 'Obtain certified copy of birth certificate',
        estimatedTime: 30,
        requiredDocuments: ['NATIONAL_ID'],
        fee: 100.0,
      },
      {
        name: 'Marriage Certificate',
        code: 'MAR-CERT',
        description: 'Obtain certified copy of marriage certificate',
        estimatedTime: 30,
        requiredDocuments: ['NATIONAL_ID', 'MARRIAGE_CERTIFICATE'],
        fee: 100.0,
      },
      {
        name: 'Death Certificate',
        code: 'DEATH-CERT',
        description: 'Obtain certified copy of death certificate',
        estimatedTime: 30,
        requiredDocuments: ['NATIONAL_ID'],
        fee: 100.0,
      },
    ],
    DMT: [
      {
        name: 'Driving License Application',
        code: 'DL-NEW',
        description: 'Apply for new driving license',
        estimatedTime: 90,
        requiredDocuments: ['NATIONAL_ID', 'MEDICAL_CERTIFICATE'],
        fee: 2500.0,
      },
      {
        name: 'License Renewal',
        code: 'DL-REN',
        description: 'Renew existing driving license',
        estimatedTime: 45,
        requiredDocuments: ['NATIONAL_ID'],
        fee: 1500.0,
      },
      {
        name: 'Vehicle Registration',
        code: 'VEH-REG',
        description: 'Register new vehicle',
        estimatedTime: 60,
        requiredDocuments: ['NATIONAL_ID', 'OTHER'],
        fee: 5000.0,
      },
    ],
    'DS-COL': [
      {
        name: 'Grama Niladhari Certificate',
        code: 'GN-CERT',
        description: 'Character certificate from Grama Niladhari',
        estimatedTime: 30,
        requiredDocuments: ['NATIONAL_ID'],
        fee: 50.0,
      },
      {
        name: 'Income Certificate',
        code: 'INC-CERT',
        description: 'Certificate of income verification',
        estimatedTime: 45,
        requiredDocuments: ['NATIONAL_ID', 'BANK_STATEMENT'],
        fee: 100.0,
      },
    ],
    DIR: [
      {
        name: 'Tax Registration',
        code: 'TAX-REG',
        description: 'Register for tax identification number',
        estimatedTime: 60,
        requiredDocuments: ['NATIONAL_ID', 'BANK_STATEMENT'],
        fee: 0.0,
      },
      {
        name: 'Tax Clearance Certificate',
        code: 'TAX-CLEAR',
        description: 'Obtain tax clearance certificate',
        estimatedTime: 45,
        requiredDocuments: ['NATIONAL_ID'],
        fee: 500.0,
      },
    ],
  };

  for (const department of departments) {
    const services =
      servicesByDepartment[
        department.code as keyof typeof servicesByDepartment
      ] || [];

    for (const service of services) {
      await prisma.service.create({
        data: {
          ...service,
          departmentId: department.id,
        },
      });
    }
  }

  console.log(`Services have been seeded for all departments`);
};

const seedTimeSlots = async (departments: any[]) => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const timeSlots = [
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '13:00', end: '13:30' },
    { start: '13:30', end: '14:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
  ];

  for (const department of departments) {
    for (const dayName of weekdays) {
      for (const slot of timeSlots) {
        await prisma.timeSlot.upsert({
          where: {
            departmentId_date_startTime: {
              departmentId: department.id,
              date: dayName,
              startTime: slot.start,
            },
          },
          update: {}, // Don't update if exists
          create: {
            departmentId: department.id,
            date: dayName,
            startTime: slot.start,
            endTime: slot.end,
            maxBookings: faker.number.int({ min: 2, max: 5 }),
            currentBookings: 0,
            status: 'AVAILABLE',
          },
        });
      }
    }
  }

  console.log(`Time slots have been seeded for all departments`);
};

const main = async () => {
  await seedUsers();
  const departments = await seedDepartments(); // Added department seeding
  await seedOfficers(departments); // Added officer seeding
  await seedServices(departments); // Added service seeding
  await seedTimeSlots(departments); // Added time slot seeding
  await prisma.$disconnect();
};

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
