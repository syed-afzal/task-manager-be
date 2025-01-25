import mongoose from "mongoose"

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  icon: { type: String, required: true}
})

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checklist: [checklistItemSchema],
})

export default mongoose.model("Task", taskSchema)

