const job = require("../models/job")


const createJobPost = async (req, res) => {
    try {

        const { companyName, logoUrl, title, description, salary, location, duration, locationType, skills, refUserId } = req.body

        if (!companyName || !logoUrl || !title || !description || !salary || !location || !duration || !locationType || !skills) {
            return res.status(404).json({
                message: "invalid data"
            })
        }

        const userId = req.userId
        const JobDetails = new job({
            companyName, logoUrl, title, description, salary, location, duration, locationType, skills, refUserId: userId
        })

        await JobDetails.save()

        res.json({ message: "Job created successfully" })

    } catch (error) {
        next(error)
    }
}

const getJobDetailsById = async (req, res) => {
    try {
        const jobId = req.params.jobId

        const jobDetails = await job.findById(jobId)

        if (!jobDetails) {
            return res.status(404).json({
                message: "invalid data"
            })
        }

        res.json({
            data: jobDetails
        })

    } catch (error) {
        next(error)

    }
}

const updateJobDetailsById = async (req, res) => {

    try {

        const jobId = req.params.jobId
        const userId = req.userId
        if (!jobId) {
            return res.status(404).json({
                message: "no jobId found"
            })
        }

        const isJobExists = await job.findOne({ _id: jobId, refUserId: userId })
        if (!isJobExists) {
            return res.status(404).json({
                message: "job does not exist"
            })
        }

        const { companyName, logoUrl, title, description, salary, location, duration, locationType, skills } = req.body

        if (!companyName || !logoUrl || !title || !description || !salary || !location || !duration || !locationType || !skills) {
            return res.status(404).json({
                message: "invalid data"
            })
        }

        await job.updateOne(
            { _id: jobId, refUserId: userId },
            {
                $set: {
                    companyName, logoUrl, title, description, salary, location, duration, locationType, skills,

                },
            }
        )

        res.json({
            message: "job updated successfully",
            data: job
        })
    } catch (error) {
        next(error)

    }

}

const getAllJobs = async (req, res, next) => {
    try {
        const title = req.query.title || ""
        const skills = req.query.skills
        let filteredSkills
        let filter = {}
        if (skills) {
            filteredSkills = skills?.split(",")
            filter = { skills: { $in: filteredSkills } }
        }
        const jobList = await job.find({
            title: { $regex: title, $options: "i" },
            ...filter
        },
            {
                companyName: 1, title: 1    //second argument to only fetch any specific thing
            }
        )
        res.json({
            // length: jobList.length,
            data: jobList
        })
    } catch (error) {
        next(error)
    }
}
module.exports = { createJobPost, getJobDetailsById, updateJobDetailsById, getAllJobs }