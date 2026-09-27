import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Assignment } from '../models/Grade';
import { SchoolClass } from '../models/SchoolClass';
import { CreateAssignmentInput, SubmitGradeInput } from '@school/shared';

export const createAssignment = async (
  req: Request<{}, {}, CreateAssignmentInput>,
  res: Response
): Promise<void> => {
  try {
    const { classId, title, description, dueDate, maxPoints, weight } = req.body;

    const schoolClass = await SchoolClass.findById(classId);
    if (!schoolClass) {
      res.status(404).json({ success: false, error: 'Class not found.' });
      return;
    }

    const assignment = new Assignment({
      classId: new mongoose.Types.ObjectId(classId),
      title,
      description,
      dueDate,
      maxPoints: maxPoints || 100,
      weight: weight || 10,
      entries: [],
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error creating assignment.' });
  }
};

export const getAssignmentsByClass = async (req: Request<{ classId: string }>, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const assignments = await Assignment.find({
      classId: new mongoose.Types.ObjectId(classId),
    }).populate('entries.studentId', 'firstName lastName email studentId');

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching assignments.' });
  }
};

export const submitGrade = async (req: Request<{}, {}, SubmitGradeInput>, res: Response): Promise<void> => {
  try {
    const { assignmentId, studentId, pointsEarned, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({ success: false, error: 'Assignment not found.' });
      return;
    }

    const percentage = (pointsEarned / assignment.maxPoints) * 100;
    let letterGrade = 'F';
    if (percentage >= 93) letterGrade = 'A';
    else if (percentage >= 90) letterGrade = 'A-';
    else if (percentage >= 87) letterGrade = 'B+';
    else if (percentage >= 83) letterGrade = 'B';
    else if (percentage >= 80) letterGrade = 'B-';
    else if (percentage >= 77) letterGrade = 'C+';
    else if (percentage >= 73) letterGrade = 'C';
    else if (percentage >= 70) letterGrade = 'C-';
    else if (percentage >= 60) letterGrade = 'D';

    const existingIndex = assignment.entries.findIndex(
      (e) => e.studentId.toString() === studentId
    );

    const gradeEntry = {
      studentId: new mongoose.Types.ObjectId(studentId),
      pointsEarned,
      letterGrade,
      feedback,
      submittedAt: new Date(),
    };

    if (existingIndex >= 0) {
      assignment.entries[existingIndex] = gradeEntry as any;
    } else {
      assignment.entries.push(gradeEntry as any);
    }

    await assignment.save();

    res.json({
      success: true,
      message: 'Grade recorded successfully',
      data: assignment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error saving grade.' });
  }
};

export const getStudentGrades = async (req: Request<{ studentId: string }>, res: Response): Promise<void> => {
  try {
    const studentId = req.params.studentId || req.user?._id?.toString();

    if (!studentId) {
      res.status(400).json({ success: false, error: 'Student ID is required.' });
      return;
    }

    const assignments = await Assignment.find({
      'entries.studentId': new mongoose.Types.ObjectId(studentId as string),
    }).populate('classId', 'name code');

    const targetStudentId = studentId.toString();
    const gradeRecords = assignments.map((a) => {
      const entry = a.entries.find((e) => e.studentId.toString() === targetStudentId);
      return {
        assignmentId: a._id,
        assignmentTitle: a.title,
        className: (a.classId as any)?.name || 'Class',
        classCode: (a.classId as any)?.code || '',
        maxPoints: a.maxPoints,
        pointsEarned: entry?.pointsEarned ?? 0,
        letterGrade: entry?.letterGrade ?? 'N/A',
        feedback: entry?.feedback ?? '',
        submittedAt: entry?.submittedAt,
        dueDate: a.dueDate,
      };
    });

    const totalPointsPossible = gradeRecords.reduce((acc, g) => acc + g.maxPoints, 0);
    const totalPointsEarned = gradeRecords.reduce((acc, g) => acc + g.pointsEarned, 0);
    const overallPercentage = totalPointsPossible > 0 ? Math.round((totalPointsEarned / totalPointsPossible) * 100) : 100;

    res.json({
      success: true,
      data: {
        summary: {
          overallPercentage,
          totalGradedAssignments: gradeRecords.length,
          totalPointsEarned,
          totalPointsPossible,
        },
        records: gradeRecords,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching student grades.' });
  }
};
