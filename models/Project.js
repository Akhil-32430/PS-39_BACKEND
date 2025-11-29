import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    repoLink: String,
    demoLink: String,
    mediaUrl: String, // for image/video link
    milestones: [
      {
        label: String,
        completed: { type: Boolean, default: false }
      }
    ],
    status: {
      type: String,
      enum: ["pending", "in-review", "approved", "changes-required"],
      default: "pending"
    },
    feedback: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
