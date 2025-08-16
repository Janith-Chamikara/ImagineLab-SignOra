"use server";
import { FieldValues } from "react-hook-form";
import { axiosPublic } from "./axios";
import { isAxiosError } from "axios";
import { AppointmentStatus, Status } from "./types";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

//auth actions
export const loginAction = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("/auth/sign-in", data);
    console.log(response.data);
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;
    const accessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const refreshTokenExpiresIn = response.data.refreshTokenExpiresIn;
    return {
      data: {
        user: { ...response.data.user },
        tokenInfo: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        },
      },
      message: response.data.message,
      status: "success",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: "error",
      } as Status;
    }
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axiosPublic.get("/auth/refresh", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    console.log(response);
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    const newAccessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const newRefreshTokenExpiresIn = response.data.refreshTokenExpiresIn;

    return {
      data: {
        accessToken: newAccessToken,
        accessTokenExpiresIn: newAccessTokenExpiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn: newRefreshTokenExpiresIn,
      },
      message: response.data.message,
      status: "success",
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: "error",
      } as Status;
    }
  }
};

export const signUpAction = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post("auth/sign-up", data);
    console.log(response.data);
    return {
      status: "success",
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "SIGN UP ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const completeOnboarding = async (userId: string, data: FieldValues) => {
  try {
    const response = await axiosPublic.post(
      `auth/complete-onboarding?id=${userId}`,
      data
    );
    console.log(response.data);
    return {
      status: "success",
      data: response.data.updatedUser,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error, "ONBORDING ERROR");
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//notification actions
export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/notifications/get-all?userId=${session.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return { notifications: response.data };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [] };
  }
}
export async function markNotificationAsRead(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.post(
      `/notifications/mark-read?id=${id}&userId=${session.user.id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return { notification: response.data };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await axiosPublic.post(
      `/notifications/mark-all-read?userId=${session.user.id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all notifications as read");
  }
}

//department actions
export async function createDepartment(data: FieldValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.post(`/department/create`, data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });

    return {
      notification: response.data,
      message: response.data.message || "Department created successfully",
      status: "success",
    } as Status;
  } catch (error) {
    console.error("Error creating department:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

export async function getAllDepartments() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(`/department/get-all`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });

    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Fetched all departments successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching all departments:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}
export async function getDepartmentById(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/department/get-info-single?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Fetched department successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching department by ID:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

export async function createService(data: FieldValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.post(
      `/department/create-service`,
      data,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return {
      notification: response.data,
      message:
        response.data.message || "Department service created successfully",
      status: "success",
    } as Status;
  } catch (error) {
    console.error("Error creating department service:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

//timeslot actions
export async function getAvailableTimeSlots(
  departmentId: string,
  date: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/timeslot/available?departmentId=${departmentId}&date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return {
      data: response.data,
      status: "success",
      message:
        response.data.message || "Fetched available time slots successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

export async function bookTimeSlot(
  timeSlotId: string,
  departmentId: string,
  userId: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.put(
      `/timeslot/book`,
      { timeSlotId, departmentId, userId },
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Time slot booked successfully",
    } as Status;
  } catch (error) {
    console.error("Error booking time slot:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

//appointment actions
export async function createAppointment(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const response = await axiosPublic.post(`/appointment/create`, formData, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Time slot booked successfully",
    } as Status;
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}

export async function getUserAppointments() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const url =
      session.user.role === "OFFICER"
        ? `/appointment/get-all-for-officer?departmentId=${session.user.departmentId}` // Officers can see all appointments
        : `/appointment/get-all?userId=${session.user.id}`; // Regular users see only their appointments

    const response = await axiosPublic.get(url, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });

    console.log("API Response:", response.data);
    return {
      data: response.data,
      status: "success",
      message: "Fetched appointments successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return {
      status: "error",
      message: "Failed to fetch appointments",
    } as Status;
  }
}
export async function getAppointmentById(appointmentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/appointment/get-single?appointmentId=${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return {
      data: response.data,
      status: "success",
      message: "Fetched appointment successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      status: "error",
      message: "Failed to fetch appointment",
    } as Status;
  }
}

export async function updateAppointment(
  appointmentId: string,

  status: AppointmentStatus
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.put(
      `/appointment/update-status?appointmentId=${appointmentId}&status=${status}&officerId=${session.user.id}&`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );

    console.log("API Response:", response.data);
    return {
      data: response.data,
      status: "success",
      message: "Updated appointment successfully",
    } as Status;
  } catch (error) {
    console.error("Error updating appointment:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message:
          error?.response?.data.message || "Failed to update appointment",
      } as Status;
    }
  }
}

//feedback actions
export async function submitFeedback(data: FieldValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const response = await axiosPublic.post(`/feedback/create`, data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Feedback submitted successfully",
    } as Status;
  } catch (error) {
    console.error("Error creating feedback:", error);

    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}
export async function getFeedbacksByAppointmentId(appointmentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const response = await axiosPublic.get(
      `/feedback/by-appointment-id?appointmentId=${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      }
    );
    console.log("API Response:", response.data);

    return {
      data: response.data,
      status: "success",
      message: response.data.message || "Fetched feedbacks successfully",
    } as Status;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    if (isAxiosError(error)) {
      return {
        status: "error",
        message: error.response?.data.message,
      } as Status;
    }
  }
}
