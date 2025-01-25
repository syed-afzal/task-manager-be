import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { Router } from "express"

const router = Router()

router.post("/register", async  (req:any, res:any) => {
  try {
    const { username, password } = req.body
    let user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }
    user = new User({ username, password })
    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string)
    res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req:any, res:any) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string)
    res.json({ token })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message:error })
  }
})

export default router

