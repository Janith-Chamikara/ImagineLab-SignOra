## Sample ENV

```
DATABASE_URL="file:./dev.db"
PORT=3001
JWT_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=100
REFRESH_TOKEN_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
ACCESS_TOKEN_SECRET=45ac78fa5c459c2c456a7390b26a8c0b
REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC=432000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=dgkrcxt3p
CLOUDINARY_API_KEY=768998232622312
CLOUDINARY_API_SECRET=gnR7DwE0EVeQ121DhbiN9wE8sWA
CLOUDINARY_FOLDER=govTech
```

## To run in localhost

```
npm install

npm run seed

npm run start:dev
```

## Flow

#### **1. User Registration and Account Setup**

- **Janith** creates an account on the system by providing his personal details (e.g., email, national ID, name, date of birth, etc.).
  - **User model**:
    - `email: janith@example.com`
    - `nationalId: 987654321V`
    - `firstName: Janith`
    - `lastName: Chamikara`
    - `dateOfBirth: 1990-05-15`
    - `isVerified: true`

#### **2. Department Setup**

- Janith is seeking a passport through the **Department of Immigration and Emigration**.
  - **Department model**:
    - `name: Department of Immigration and Emigration`
    - `code: 101`
    - `workingHours: {"monday": "9am-5pm", "tuesday": "9am-5pm", ...}`

#### **3. Service Selection**

- Janith selects the **passport service** for his application.
  - **Service model**:
    - `name: Passport Application`
    - `description: Apply for a new passport`
    - `fee: 3000 LKR`
    - `estimatedTime: 60 minutes`
    - `requiredDocuments: ["NATIONAL_ID", "BIRTH_CERTIFICATE", "UTILITY_BILL"]`

#### **4. Time Slot Selection**

- Janith views available time slots and books one for **2025-08-20 at 9:00 AM**.
  - **TimeSlot model**:
    - `date: 2025-08-20`
    - `startTime: 9:00 AM`
    - `endTime: 10:00 AM`
    - `maxBookings: 5`
    - `currentBookings: 2`

#### **5. Appointment Booking**

- Janith successfully books his appointment for the passport application.
  - **Appointment model**:
    - `bookingReference: A123456789`
    - `qrCode: "QRCodeImageData"`
    - `status: CONFIRMED`
    - `service: Passport Application`
    - `appointmentDate: 2025-08-20 09:00 AM`

#### **6. Document Upload**

- Janith uploads his required documents (National ID and Birth Certificate) for the passport application.
  - **Document model**:
    - `documentType: NATIONAL_ID`
    - `filePath: "/uploads/id/987654321V.jpg"`
    - `status: PENDING`

#### **7. Officer Assignment (Automatic)**

- **Automatic Assignment**:
  - The system checks which officers are available at **2025-08-20, 09:00 AM** in the **Department of Immigration and Emigration**.
  - It finds **Officer Anjali** available and with a manageable workload (e.g., fewer appointments).
  - **Officer Anjali** is automatically assigned to **Janith's appointment** for processing.

- **Notification to Officer**:
  - **Officer Anjali** receives a notification about the assigned appointment:
    _"You have been assigned to the passport application for Janith Chamikara on 2025-08-20 at 9:00 AM."_

#### **8. Officer Processing Documents**

- **Officer Anjali** reviews the documents uploaded by **Janith** (National ID and Birth Certificate) to verify their authenticity and completeness.
  - **Document model** (after officer review):
    - `status: APPROVED`
    - `processedBy: Officer Anjali`

#### **9. Notification to User**

- **Janith** receives a notification about the document approval and appointment confirmation.
  - **Notification model** (SMS):
    - `type: DOCUMENT_STATUS`
    - `channel: SMS`
    - `message: "Your documents for the passport application have been approved. Your appointment is confirmed for 2025-08-20 at 9:00 AM."`

#### **10. Appointment Completed**

- On **2025-08-20**, **Janith** attends his appointment for the passport. **Officer Anjali** completes the required processing, and the passport is issued.

#### **11. Feedback Request**

- After the appointment is completed, **Janith** is prompted to provide feedback on his experience.
  - **Feedback model**:
    - `appointmentId: A123456789`
    - `rating: 4`
    - `comment: "Good service, but I had to wait for an hour."`

#### **12. Analytics and Reporting**

- The **Department of Immigration and Emigration** tracks the appointment data for reporting purposes, including the total number of passport applications, completed applications, and feedback received.
  - **Analytics model**:
    - `totalBookings: 100`
    - `completedBookings: 90`
    - `noShowRate: 10%`

#### **13. Audit Logs**

- Every action taken by **Officer Anjali** is logged for auditing and compliance purposes, ensuring transparency and security.
  - **AuditLog model**:
    - `action: "APPROVED DOCUMENT"`
    - `entityType: "Document"`
    - `entityId: "987654321V"`
    - `officerId: "OfficerAnjali"`
    - `timestamp: "2025-08-19 10:15 AM"`

---

### **Summary of Officer Assignment Process**:

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
