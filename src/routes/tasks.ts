import express, { Request, Response, NextFunction, RequestHandler } from "express"
import Task from "../models/Task"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

router.use<any>(authMiddleware)

const createTask: RequestHandler = async (req:any, res:any, next) => {
  try {
    const { title, checklist } = req.body;
    const task = new Task({
      title,
      checklist,
      user: req.user?.userId, // Accessing 'user' here
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};
const getTasks: RequestHandler = async (req:any, res:any, next) => {
  try {
    const tasks = await Task.find({ user: req.user?.userId })
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

const updateTask = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, checklist } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user?.userId },
      { title, checklist },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return; // Ensure you exit the function after sending a response
    }

    res.json(task); // Send the updated task as the response
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

const deleteTask = async (req: any, res: any, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user?.userId,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return; // Ensure the function exits after sending a response
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
};
router.post("/", createTask)
router.get("/", getTasks)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router

