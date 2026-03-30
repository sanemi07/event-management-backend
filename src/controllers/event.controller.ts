import { Request, Response } from "express";
import { eventSchema } from "../validators/event.validator";
import { prisma } from "../config/prisma";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const parsedInput = eventSchema.safeParse(req.body);

    if (!parsedInput.success) {
      return res.status(400).json({
        error: parsedInput.error.format(),
      });
    }
    const data=parsedInput.data
    const event=await prisma.event.create({
        data:{
            title:data.title,
            description :data.description,
            event_date:new Date(data.event_date),
            total_capacity:data.total_capacity,
            remaining_tickets:data.total_capacity
        
        }
    })

    return res.status(201).json({
      message: "Event Created successfully",
      event
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
export const getEvents=async(req: Request, res: Response)=>{
    try {
        const events=await prisma.event.findMany({
            where:{
                event_date:{
                    gt:new Date()
                }
            },
            orderBy:{
                event_date:"asc"
            }

        })
        return res.status(200).json(events)
        
    } 
    catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }

}
