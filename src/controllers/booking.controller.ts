import { Request, Response } from "express";
import { bookingSchema } from "../validators/booking.validator";
import { prisma } from "../config/prisma";
import { attendanceSchema } from "../validators/attendance.validator";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.format(),
      });
    }
    const { userId, eventId } = parsed.data;

    const booking = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id: eventId,
        },
        select: {
          id: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const updatedEvent = await tx.event.updateMany({
        where: {
          id: eventId,
          remaining_tickets: {
            gt: 0,
          },
        },
        data: {
          remaining_tickets: {
            decrement: 1,
          },
        },
      });

      if (updatedEvent.count === 0) {
        throw new Error("No tickets available");
      }

      return tx.booking.create({
        data: {
          eventId,
          userId,
          booking_code: `BOOK-${eventId}-${userId}-${Date.now()}`,
        },
      });
    });

    return res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message ?? "Something went wrong",
    });
  }
};
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true, 
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const parsed = attendanceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.format(),
      });
    }

    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        error: "Invalid event ID",
      });
    }

    const { booking_code } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: {
        booking_code: booking_code,
      },
    });

    if (!booking) {
      return res.status(404).json({
        error: "Invalid booking code",
      });
    }

    if (booking.eventId !== eventId) {
      return res.status(400).json({
        error: "Booking does not belong to this event",
      });
    }

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        bookingId: booking.id,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        error: "Attendance already marked",
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        bookingId: booking.id,
      },
    });

    return res.status(201).json({
      message: "Attendance marked",
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
