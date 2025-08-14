import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

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
  await prisma.$disconnect();
};

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
