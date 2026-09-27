import { Request, Response } from 'express';
import { SchoolClass } from '../models/SchoolClass';
import { User } from '../models/User';

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let query: any = {};

    if (user.role === 'TEACHER') {
      query.teacherId = user._id;
    } else if (user.role === 'STUDENT') {
      query.studentIds = user._id;
    }

    const classes = await SchoolClass.find(query)
      .populate('teacherId', 'firstName lastName email')
      .populate('studentIds', 'firstName lastName email studentId gradeLevel')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: classes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching classes.' });
  }
};

export const getClassById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schoolClass = await SchoolClass.findById(id)
      .populate('teacherId', 'firstName lastName email')
      .populate('studentIds', 'firstName lastName email studentId gradeLevel');

    if (!schoolClass) {
      res.status(404).json({ success: false, error: 'Class not found.' });
      return;
    }

    res.json({
      success: true,
      data: schoolClass,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching class.' });
  }
};

export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, gradeLevel, teacherId, roomNumber, academicYear } = req.body;

    const existing = await SchoolClass.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, error: 'Class code already exists.' });
      return;
    }

    const newClass = new SchoolClass({
      name,
      code: code.toUpperCase(),
      gradeLevel,
      teacherId,
      roomNumber,
      academicYear: academicYear || '2026-2027',
      studentIds: [],
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error creating class.' });
  }
};
