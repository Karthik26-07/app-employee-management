const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');

router.get('/salary', async (req, res, next) => {
    try {
        const response = await repository.salary();
        res.status(200).json({
            success: true,
            data: response,
            message: `Available teams`,
        });
    } catch (error) {
        next(error)
    }
})

router.post('/update', async (req, res, next) => {
    try {
        await repository.updateSalary(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully updated`,
        });
    } catch (error) {
        next(error);
    }
})

module.exports = router;