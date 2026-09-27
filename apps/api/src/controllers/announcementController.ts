import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement';
import { CreateAnnouncementInput } from '@school/shared';

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const { category } = req.query;

    let filter: any = {};

    if (userRole) {
      filter.targetRoles = { $in: [userRole] };
    }

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    const announcements = await Announcement.find(filter)
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(30);

    res.json({
      success: true,
      data: announcements,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching announcements.' });
  }
};

export const createAnnouncement = async (
  req: Request<{}, {}, CreateAnnouncementInput>,
  res: Response
): Promise<void> => {
  try {
    const { title, content, category, isPinned, targetRoles } = req.body;
    const user = req.user!;

    const announcement = new Announcement({
      title,
      content,
      category,
      isPinned: isPinned ?? false,
      authorId: user._id,
      authorName: `${user.firstName} ${user.lastName}`,
      targetRoles,
      publishDate: new Date(),
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: announcement,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error creating announcement.' });
  }
};

export const deleteAnnouncement = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Announcement not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error deleting announcement.' });
  }
};
