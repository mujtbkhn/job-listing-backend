const express = require("express");
const { createJobPost, getJobDetailsById, updateJobDetailsById, getAllJobs } = require("../controllers/job");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router()


router.post("/create", verifyToken, createJobPost);
router.get("/job-details/:jobId", getJobDetailsById);
router.put("/update/:jobId", verifyToken, updateJobDetailsById);
router.get("/all", getAllJobs)

module.exports = router