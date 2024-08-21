const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');
const { hashPassword } = require("../../utils/custom");
const { handleUpload } = require("../../middleware/fileUploadMiddleware");


router.post("/register", async (req, res, next) => {
    try {
        const { email, contact } = req.body;

        const emailExists = await repository.isEmailExists(email);
        if (emailExists) {
            throw new Error('Email already exists');
        }

        const contactExists = await repository.isContactExists(contact);
        if (contactExists) {
            throw new Error('Contact already exists');
        }
        const hashedPassword = await hashPassword('password');
        const body = { password: hashedPassword, ...req.body };

        const result = await repository.createUser(body);

        if (result.affectedRows > 0) {
            user_id = result.insertId;
            await repository.createSalary(user_id);
            await repository.createLeave(user_id);
        }
        res.status(200).json({
            success: true,
            message: `User Registered successfully`,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/users', async (req, res, next) => {
    try {
        const result = await repository.getAllUsers();
        res.status(200).json({
            success: true,
            data: result,
            message: `Available Users`,
        });
    } catch (error) {
        next(error);
    }
})

router.post('/update', async (req, res, next) => {
    try {
        await repository.updateUser(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully updated`,
        });
    } catch (error) {
        next(error);
    }
})

router.get('/user', async (req, res, next) => {
    try {
        const user = await repository.getUser(req.userId);

        let response = {
            user: user[0],
        }
        if (user[0].user_type != "ADMIN") {
            const salary = await repository.getSalary(req.userId);
            response = {
                user: user[0],
                salary: salary[0]
            }
        }
        res.status(200).json({
            success: true,
            data: response,
            message: `Available User`,
        });
    } catch (error) {
        next(error);
    }
})

router.post('/update-profile', handleUpload, async (req, res, next) => {
    try {

        const contactExists = await repository.isContactExists(req.body.contact, req.userId);
        if (contactExists) {
            throw new Error('Contact already exists');
        }
        await repository.updateProfile(req);
        res.status(200).json({
            success: true,
            message: `Successfully updated`,
        });
    } catch (error) {
        next(error);
    }
})
module.exports = router;