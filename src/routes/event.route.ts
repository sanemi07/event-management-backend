import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event.controller";

const router=Router()

router.post("/events",createEvent)
router.get("/events",getEvents)




export default router