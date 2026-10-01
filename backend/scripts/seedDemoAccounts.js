const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Workout = require("../src/models/Workout");

const DEMO_USER = {
  name: "Sam Team Demo User",
  email: "demo.user@samfittrack.local",
  password: "SamDemo@12345",
  role: "user",
};

const DEMO_ADMIN = {
  name: "Sam Team Demo Admin",
  email: "demo.admin@samfittrack.local",
  password: "SamAdmin@12345",
  role: "admin",
};

const SAMPLE_WORKOUTS = [
    { workoutName: "Strength Starter", category: "Strength", duration: 35, caloriesBurned: 240, workoutDate: new Date("2026-10-01") },
    { workoutName: "Morning Mobility", category: "Mobility", duration: 25, caloriesBurned: 120, workoutDate: new Date("2026-09-30") }
];

async function upsertAccount(account) {
  let user = await User.findOne({ email: account.email }).select("+password");
  if (!user) {
    user = await User.create(account);
    return user;
  }
  user.name = account.name;
  user.role = account.role;
  user.password = account.password;
  await user.save();
  return user;
}

async function run() {
  try {
    await connectDB();
    console.log("\n=== AI FITTRACK SAM TEAM DEMO SEED ===");

    const demoUser = await upsertAccount(DEMO_USER);
    const demoAdmin = await upsertAccount(DEMO_ADMIN);

    for (const item of SAMPLE_WORKOUTS) {
      await Workout.findOneAndUpdate(
        { user: demoUser._id, workoutName: item.workoutName },
        { ...item, user: demoUser._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`[PASS] Demo User : ${demoUser.email}`);
    console.log(`[PASS] Demo Admin: ${demoAdmin.email}`);
    console.log(`[PASS] Sample workouts: ${SAMPLE_WORKOUTS.length}`);
    console.log(`[PASS] Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[FAIL]", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
