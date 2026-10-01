const mongoose = require("mongoose");
const Workout = require("../models/Workout");

// Create workout
const createWorkout = async (req, res, next) => {
  try {
    const {
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate,
    } = req.body;

    if (
      !workoutName ||
      !category ||
      duration === undefined ||
      caloriesBurned === undefined ||
      !workoutDate
    ) {
      res.status(400);
      throw new Error("All workout fields are required");
    }

    const workout = await Workout.create({
      user: req.user._id,
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate,
    });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get authenticated user's workouts
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({
      user: req.user._id,
    }).sort({
      workoutDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Workouts retrieved successfully",
      data: {
        workouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search authenticated user's workouts
const searchWorkouts = async (req, res, next) => {
  try {
    const { workoutName, category, workoutDate } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (workoutName) {
      filter.workoutName = {
        $regex: workoutName.trim(),
        $options: "i",
      };
    }

    if (category) {
      filter.category = {
        $regex: category.trim(),
        $options: "i",
      };
    }

    if (workoutDate) {
      const startDate = new Date(`${workoutDate}T00:00:00.000Z`);
      const endDate = new Date(`${workoutDate}T23:59:59.999Z`);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        res.status(400);
        throw new Error("Invalid workout date");
      }

      filter.workoutDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const workouts = await Workout.find(filter).sort({
      workoutDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Workout search completed successfully",
      data: {
        workouts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get one workout
const getWorkoutById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid workout ID");
    }

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    res.status(200).json({
      success: true,
      message: "Workout retrieved successfully",
      data: {
        workout,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update workout
const updateWorkout = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid workout ID");
    }

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    const allowedFields = [
      "workoutName",
      "category",
      "duration",
      "caloriesBurned",
      "workoutDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        workout[field] = req.body[field];
      }
    });

    const updatedWorkout = await workout.save();

    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      data: {
        workout: updatedWorkout,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete workout
const deleteWorkout = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid workout ID");
    }

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      res.status(404);
      throw new Error("Workout not found");
    }

    await workout.deleteOne();

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
      data: {
        id: workout._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  searchWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};