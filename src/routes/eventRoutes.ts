// src/routes/eventRoutes.ts
import express from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/multerConfig';

const router = express.Router();

router.route('/')
  .post(protect, upload.array('images', 10), createEvent)
  .get(getAllEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, upload.array('images', 10), updateEvent)
  .delete(protect, deleteEvent);

export default router;
