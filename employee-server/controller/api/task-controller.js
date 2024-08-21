const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');

router.post('/create-task', async (req, res, next) => {
    try {

        await repository.createTask(req.body, req.userId);
        res.status(200).json({
            success: true,
            message: `Task created successfully`,
        });

    } catch (error) {
        next(error)
    }
})

router.post('/update', async (req, res, next) => {
    try {
        await repository.updateTask(req.body);
        res.status(200).json({
            success: true,
            message: `Task updated successfully`,
        });

    } catch (error) {
        next(error);
    }
})

router.get('/task-by-team', async (req, res, next) => {
    try {
        const response = await repository.getTaskByTeam(req.query, req.userId);
        res.status(200).json({
            success: true,
            data: response,
            message: `Task created successfully`,
        });
    } catch (error) {
        next(error)
    }
})

router.post('/update-task-status', async (req, res, next) => {
    try {
        await repository.updateTaskStatus(req.body);
        res.status(200).json({
            success: true,
            message: `Task updated successfully`,
        });

    } catch (error) {
        next(error);
    }
})
router.post('/delete-task', async (req, res, next) => {
    try {
        await repository.deleteTask(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully deleted`,
        });
    } catch (error) {
        next(error);
    }
})
module.exports = router;