const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../../utils/env-helper");


router.post("/login", async (req, res, next) => {
    try {
        const { password } = req.body;
        const result = await repository.login(req.body);

        if (result.length === 0) {
            throw new Error("User not Found");
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        if (user.is_active === 0) {
            throw new Error("Access denied ! .Please contact admin for future assistance");
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '6h',
        });

        const response = {
            accessToken: token,
            role: user.user_type,
            image: user.image
        }
        res.status(200).json({
            success: true,
            data: response,
            message: `Login Success`
        });

    } catch (error) {
        next(error);
    }
})

module.exports = router;