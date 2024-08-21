const router = require('express').Router();

const authRoutes = require('./api/auth-controller');
const userRoutes = require('./api/user-controller');
const teamRoutes = require('./api/team-controller');
const salaryRoutes = require('./api/salary-controller');
const leaveRoutes = require('./api/leave-controller');
const taskRoutes = require('./api/task-controller');
const verifyToken = require('../middleware/authMiddleware');

router.use('/api/auth', authRoutes);
router.use('/api/user', verifyToken, userRoutes);
router.use('/api/team', verifyToken, teamRoutes);
router.use('/api/salary', verifyToken, salaryRoutes);
router.use('/api/leave', verifyToken, leaveRoutes);
router.use('/api/task', verifyToken, taskRoutes);

router.use('/api', (req, res) => res.status(404).json('No API route found'));

module.exports = router;