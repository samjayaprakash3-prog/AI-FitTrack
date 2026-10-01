import { apiRequest } from "./api";

const getWorkouts = () =>
  apiRequest("/workouts");

const getWorkoutById = (workoutId) =>
  apiRequest(`/workouts/${workoutId}`);

const createWorkout = (workout) =>
  apiRequest("/workouts", {
    method: "POST",
    body: workout,
  });

const updateWorkout = (workoutId, workout) =>
  apiRequest(`/workouts/${workoutId}`, {
    method: "PUT",
    body: workout,
  });

const deleteWorkout = (workoutId) =>
  apiRequest(`/workouts/${workoutId}`, {
    method: "DELETE",
  });

const searchWorkouts = (workoutName) =>
  apiRequest(
    `/workouts/search?workoutName=${encodeURIComponent(
      workoutName ?? ""
    )}`
  );

/*
 * Backward-compatible aliases for older pages.
 */
const list = getWorkouts;

const search = ({
  workoutName = "",
  category = "",
  workoutDate = "",
} = {}) => {
  const params = new URLSearchParams();

  if (workoutName.trim()) {
    params.set(
      "workoutName",
      workoutName.trim()
    );
  }

  if (category.trim()) {
    params.set(
      "category",
      category.trim()
    );
  }

  if (workoutDate) {
    params.set(
      "workoutDate",
      workoutDate
    );
  }

  const suffix =
    params.toString()
      ? `?${params.toString()}`
      : "";

  return apiRequest(
    `/workouts/search${suffix}`
  );
};

const getById =
  getWorkoutById;

const create =
  createWorkout;

const update =
  updateWorkout;

const remove =
  deleteWorkout;

export const workoutService = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  searchWorkouts,

  list,
  search,
  getById,
  create,
  update,
  remove,
};
