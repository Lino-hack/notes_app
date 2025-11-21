const fs = require("fs");
const path = require("path");
const Note = require("../models/Note");
const sanitizeRichText = require("../utils/sanitizeHtml");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const buildAttachment = (file) =>
  file
    ? {
        filename: file.originalname,
        storedName: file.filename,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }
    : undefined;

const removeAttachmentIfExists = (storedName) => {
  if (!storedName) return;
  const absolutePath = path.join(uploadsDir, storedName);
  fs.promises
    .access(absolutePath)
    .then(() => fs.promises.unlink(absolutePath))
    .catch(() => null);
};

exports.createNote = async (req, res) => {
  try {
    const { title, content = "", category } = req.body;
    const attachment = buildAttachment(req.file);

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: sanitizeRichText(content),
      category,
      attachment,
    });

    return res.status(201).json({ note });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.getNotes = async (req, res) => {
  try {
    const {
      search = "",
      category,
      from,
      to,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const filters = { user: req.user._id };

    if (search) {
      const safeSearch = escapeRegex(search);
      filters.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filters.category = category;
    }

    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      category: { category: 1, createdAt: -1 },
    };

    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [notes, total] = await Promise.all([
      Note.find(filters)
        .sort(sortOptions[sort] || sortOptions.latest)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Note.countDocuments(filters),
    ]);

    return res.json({
      notes,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        hasMore: skip + notes.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!note) return res.status(404).json({ message: "Note non trouvée" });
    return res.json({ note });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const existingNote = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    if (req.file) {
      removeAttachmentIfExists(existingNote.attachment?.storedName);
      existingNote.attachment = buildAttachment(req.file);
    }

    if (title) existingNote.title = title.trim();
    if (typeof content !== "undefined") {
      existingNote.content = sanitizeRichText(content);
    }
    if (category) existingNote.category = category;

    await existingNote.save();
    return res.json({ note: existingNote });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note non trouvée" });
    removeAttachmentIfExists(note.attachment?.storedName);
    return res.json({ message: "Note supprimée" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getNoteStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [categoryStats, totalNotes, withAttachments, latestNote] = await Promise.all([
      Note.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      Note.countDocuments({ user: userId }),
      Note.countDocuments({
        user: userId,
        "attachment.url": { $exists: true, $ne: null },
      }),
      Note.findOne({ user: userId }).sort({ updatedAt: -1 }).select("updatedAt"),
    ]);

    const categories = {
      travail: 0,
      personnel: 0,
      urgent: 0,
    };

    categoryStats.forEach((stat) => {
      categories[stat._id] = stat.count;
    });

    return res.json({
      totalNotes,
      categories,
      withAttachments,
      lastUpdated: latestNote ? latestNote.updatedAt : null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
