import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance';
import { SchoolClass } from '../models/SchoolClass';
import { MarkAttendanceBatchInput } from '@school/shared';

export const markBatchAttendance = async (
  req: Request<{}, {}, MarkAttendanceBatchInput>,
  res: Response
): Promise<void> => {
  try {
    const { classId, date, records } = req.body;

    const classExists = await SchoolClass.findById(classId);
    if (!classExists) {
      res.status(404).json({ success: false, error: 'Class not found.' });
      return;
    }

    const operations = records.map((record) => ({
      updateOne: {
        filter: {
          classId: new mongoose.Types.ObjectId(classId),
          studentId: new mongoose.Types.ObjectId(record.studentId),
          date,
        },
        update: {
          $set: {
            status: record.status,
            notes: record.notes,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.json({
      success: true,
      message: `Attendance marked successfully for ${records.length} students on ${date}.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error recording attendance.' });
  }
};

export const getClassAttendanceByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      res.status(400).json({ success: false, error: 'classId and date are required query parameters.' });
      return;
    }

    const records = await Attendance.find({
      classId: new mongoose.Types.ObjectId(classId as string),
      date: date as string,
    }).populate('studentId', 'firstName lastName email studentId');

    res.json({
      success: true,
      data: records,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching attendance records.' });
  }
};

export const getStudentAttendanceSummary = async (req: Request<{ studentId: string }>, res: Response): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.user?._id;

    if (!studentId) {
      res.status(400).json({ success: false, error: 'Student ID is required.' });
      return;
    }

    const records = await Attendance.find({
      studentId: new mongoose.Types.ObjectId(studentId as string),
    })
      .populate('classId', 'name code')
      .sort({ date: -1 })
      .limit(60);

    const totalDays = records.length;
    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const lateCount = records.filter((r) => r.status === 'LATE').length;
    const absentCount = records.filter((r) => r.status === 'ABSENT').length;
    const excusedCount = records.filter((r) => r.status === 'EXCUSED').length;

    const rate = totalDays > 0 ? Math.round(((presentCount + lateCount) / totalDays) * 100) : 100;

    res.json({
      success: true,
      data: {
        summary: {
          totalDays,
          presentCount,
          lateCount,
          absentCount,
          excusedCount,
          attendanceRate: rate,
        },
        recentRecords: records.slice(0, 15),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error computing attendance summary.' });
  }
};
