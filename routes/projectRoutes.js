import express from "express";
import Project from "../models/Project.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create project (student)
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      repoLink,
      demoLink,
      mediaUrl,
      milestones
    } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies,
      repoLink,
      demoLink,
      mediaUrl,
      milestones,
      owner: req.user._id
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get projects – student: own, admin: all
router.get("/", protect, async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { owner: req.user._id };

    const projects = await Project.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update project (owner or admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: "Not found" });

    const isOwner = proj.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // student can update content, admin can update status/feedback
    const updateData = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete project (owner or admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: "Not found" });

    const isOwner = proj.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await proj.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: update status + feedback quickly
router.patch("/:id/review", protect, adminOnly, async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
