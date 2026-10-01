const express = require("express");

const {
  createWorkout,
  getWorkouts,
  searchWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All workout routes require authentication
router.use(protect);

// Create + get all
router
  .route("/")
  .post(createWorkout)
  .get(getWorkouts);

// Search must stay before /:id
router.get("/search", searchWorkouts);

// Get, update and delete by ID
router
  .route("/:id")
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

module.exports = router;