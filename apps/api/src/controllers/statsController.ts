import { Request, Response } from 'express';
import { User } from '../models/User';
import { SchoolClass } from '../models/SchoolClass';
import { Admission } from '../models/Admission';
import { Assignment } from '../models/Grade';
import { Attendance } from '../models/Attendance';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    if (user.role === 'ADMIN') {
      const [totalStudents, totalTeachers, totalParents, totalClasses, pendingAdmissions] =
        await Promise.all([
          User.countDocuments({ role: 'STUDENT' }),
          User.countDocuments({ role: 'TEACHER' }),
          User.countDocuments({ role: 'PARENT' }),
          SchoolClass.countDocuments(),
          Admission.countDocuments({ status: { $in: ['SUBMITTED', 'UNDER_REVIEW'] } }),
        ]);

      res.json({
        success: true,
        data: {
          role: 'ADMIN',
          totalStudents,
          totalTeachers,
          totalParents,
          totalClasses,
          pendingAdmissions,
          systemStatus: 'Optimal',
          currentTerm: 'Fall 2026',
        },
      });
      return;
    }

    if (user.role === 'TEACHER') {
      const myClasses = await SchoolClass.find({ teacherId: user._id });
      const classIds = myClasses.map((c) => c._id);
      const studentCount = myClasses.reduce((acc, c) => acc + (c.studentIds?.length || 0), 0);
      const assignments = await Assignment.find({ classId: { $in: classIds } });

      res.json({
        success: true,
        data: {
          role: 'TEACHER',
          assignedClassesCount: myClasses.length,
          totalStudentsUnderCare: studentCount,
          activeAssignmentsCount: assignments.length,
          classes: myClasses,
        },
      });
      return;
    }

    if (user.role === 'STUDENT') {
      const enrolledClasses = await SchoolClass.find({ studentIds: user._id })
        .populate('teacherId', 'firstName lastName email');
      
      const attendanceRecords = await Attendance.find({ studentId: user._id });
      const totalAtt = attendanceRecords.length;
      const presentAtt = attendanceRecords.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      const attendanceRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 98;

      const assignments = await Assignment.find({ 'entries.studentId': user._id });
      const completedCount = assignments.length;

      res.json({
        success: true,
        data: {
          role: 'STUDENT',
          enrolledClassesCount: enrolledClasses.length,
          attendanceRate,
          completedAssignmentsCount: completedCount,
          classes: enrolledClasses,
        },
      });
      return;
    }

    if (user.role === 'PARENT') {
      // Find sample linked student or demo student
      const student = await User.findOne({ role: 'STUDENT' });
      res.json({
        success: true,
        data: {
          role: 'PARENT',
          linkedStudent: student ? student.toSummary() : null,
          attendanceAlerts: 0,
          pendingForms: 1,
          nextParentTeacherMeeting: 'Oct 15, 2026',
        },
      });
      return;
    }

    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching dashboard stats.' });
  }
};
