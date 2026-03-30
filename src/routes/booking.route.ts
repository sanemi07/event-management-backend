import {Router} from "express"
import {
  createBooking,
  getUserBookings,
  markAttendance,
} from "../controllers/booking.controller";


const router=Router()

router.post("/bookings",createBooking)
router.get("/users/:id/bookings",getUserBookings)
router.post("/events/:id/attendance",markAttendance)





export default router
