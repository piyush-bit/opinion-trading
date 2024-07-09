// src/controllers/eventController.ts
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinaryConfig';
import Event from '../models/Event';
import { AuthenticatedRequest } from '../middleware/authMiddleware';



export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, description, date } = req.body;
  const images = req.files as Express.Multer.File[];

  try {
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path);
        imageUrls.push(result.secure_url);
      }
    }

    const event = new Event({
      title,
      description,
      date,
      imageUrls,
      createdBy: req.user.id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().populate('createdBy', 'name');
    res.status(200).json(events);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate('createdBy', 'name');
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error : any) {
    res.status(500).json({ error: error?.message });
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  const images = req.files as Express.Multer.File[];

  try {
    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    let imageUrls = event.imageUrls || [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path);
        imageUrls.push(result.secure_url);
      }
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.imageUrls = imageUrls;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

