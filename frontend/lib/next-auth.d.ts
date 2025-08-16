/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      phoneNumber: string;
      nationalId: string;
      dateOfBirth: Date;
      address?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      isVerified: boolean;
      role: string;
      employeeId?: string;
      departmentId?: string;
      createdAt: Date;
    };
    tokenInfo: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: number;
      refreshTokenExpiresIn: number;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      phoneNumber: string;
      nationalId: string;
      dateOfBirth: Date;
      address?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      role: string;
      employeeId?: string;
      departmentId?: string;
      isVerified: boolean;
      createdAt: Date;
    };
    tokenInfo: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresIn: number;
      refreshTokenExpiresIn: number;
    };
  }
}
