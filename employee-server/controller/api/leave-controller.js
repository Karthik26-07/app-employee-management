const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');
const { calculateDaysBetween, is_cl, is_sl } = require("../../utils/custom");

router.get('/leaves', async (req, res, next) => {
    try {
        const result = await repository.leaves();
        res.status(200).json({
            success: true,
            data: result,
            message: `Available Leaves`,
        });
    } catch (error) {
        next(error);
    }
})

router.post('/update', async (req, res, next) => {
    try {
        await repository.updateLeave(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully updated`,
        });
    } catch (error) {
        next(error);
    }
})
router.post('/apply-leave', async (req, res, next) => {
    try {
        const { start_date, end_date, leave_type } = req.body;
        const total_days = calculateDaysBetween(start_date, end_date);

        // Fetch leave count for the user
        const leaveCounts = await repository.getLeaveCounts(req.userId);
        const leaveCount = leaveCounts[0];

        if (is_cl(leave_type)) {
            if (leaveCount.cl < total_days) {
                throw new Error("You don't have enough Casual Leaves to apply");
            }
        } else if (is_sl(leave_type)) {
            if (leaveCount.sl < total_days) {
                throw new Error("You don't have enough Sick Leaves to apply");
            }
        } else {
            throw new Error("Invalid leave type");
        }

        // Apply leave
        await repository.applyLeave(req.body, req.userId, total_days);

        // Send success response
        res.status(200).json({
            success: true,
            message: `Successfully applied`,
        });
    } catch (error) {
        // Forward error to error-handling middleware
        next(error);
    }
});


router.post('/cancel-leave', async (req, res, next) => {
    try {
        await repository.cancelLeave(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully cancelled`,
        });
    } catch (error) {
        next(error);
    }
})

router.get('/applied-leaves', async (req, res, next) => {
    try {
        const leaves = await repository.getAppliedLeave(req.userId);
        const leave_counts = await repository.getLeaveCounts(req.userId);
        res.status(200).json({
            success: true,
            data: { leave_counts: leave_counts, leaves: leaves },
            message: `Available Leaves`,
        });
    } catch (error) {
        next(error);
    }
})

router.get('/leave-applications', async (req, res, next) => {
    try {
        const result = await repository.getLeaveApplications();
        res.status(200).json({
            success: true,
            data: result,
            message: `Available Leaves`,
        });
    } catch (error) {
        next(error);
    }
})
router.post('/handle-leave-application', async (req, res, next) => {
    try {

        await repository.handleLeaveApplication(req.body);

        const { leave_type, total_days, user_id, status } = req.body;

        if (status == "Approved") {
            // Fetch leave count for the user
            const leaveCounts = await repository.getLeaveCounts(user_id);
            const { cl, sl, id } = leaveCounts[0];

            let CL = cl;
            let SL = sl;

            if (is_cl(leave_type)) {
                CL = CL - total_days;
            } else if (is_sl(leave_type)) {
                SL = SL - total_days;
            } else {
                throw new Error("Invalid leave type");
            }

            await repository.updateLeave({ sl: SL, cl: CL, id: id })
        }
        res.status(200).json({
            success: true,
            message: `Successfully updated`,
        });
    } catch (error) {
        next(error);
    }
})

module.exports = router;