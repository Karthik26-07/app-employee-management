const express = require("express");
const router = express.Router();
const repository = require('../../db/repository');



router.get('/users', async (req, res, next) => {
    try {
        const result = await repository.getActiveUsers();
        res.status(200).json({
            success: true,
            data: result,
            message: `Available Users`,
        });
    } catch (error) {
        next(error);
    }
})

router.post('/create-team', async (req, res, next) => {
    try {

        const response = await repository.createTeam(req.body);

        if (response.affectedRows > 0) {
            const { team_members } = req.body;
            const team_id = response.insertId;
            await repository.createTeamMembers(team_id, team_members)
        }
        res.status(200).json({
            success: true,
            message: `Team created successfully`,
        });

    } catch (error) {
        next(error)
    }
})

router.get('/teams', async (req, res, next) => {
    try {

        const { team_id } = req.query;
        const response = await repository.getTeams(team_id);

        const result = [];
        const teamsMap = new Map();

        response.forEach(row => {
            if (!teamsMap.has(row.team_id)) {
                // Create a new team entry
                teamsMap.set(row.team_id, {
                    id: row.team_id,
                    name: row.team_name,
                    description: row.team_description,
                    team_lead: {
                        id: row.team_lead_id,
                        name: row.team_lead_name,
                        image: row.team_lead_image,
                        email: row.team_lead_email,
                        contact: row.team_lead_contact,
                    },
                    team_members: []
                });
            }
            // Add member details if available
            if (row.member_id) {
                const team = teamsMap.get(row.team_id);
                // Only add members if the team has less than 3 members
                if (team_id == null) {
                    if (team.team_members.length < 3) {
                        team.team_members.push({
                            id: row.member_id,
                            name: row.member_name,
                            image: row.member_image
                        });
                    }
                } else {
                    team.team_members.push({
                        id: row.member_id,
                        name: row.member_name,
                        image: row.member_image,
                        email: row.member_email,
                        contact: row.member_contact,
                    });

                }

            }
        });

        // Convert the map to an array
        result.push(...teamsMap.values());

        res.status(200).json({
            success: true,
            data: result,
            message: `Available teams`,
        });
    } catch (error) {
        next(error);
    }
})

router.get('/team-by-lead', async (req, res, next) => {
    try {

        const response = await repository.getTeamByLead(req.userId, req.query.role);
        res.status(200).json({
            success: true,
            data: response,
            message: `Available teams`,
        });
    } catch (error) {
        next(error)
    }
})
router.get('/team-by-member', async (req, res, next) => {
    try {

        const response = await repository.getTeamByMember(req.userId);
        res.status(200).json({
            success: true,
            data: response,
            message: `Available teams`,
        });
    } catch (error) {
        next(error)
    }
})

router.get('/team-members', async (req, res, next) => {
    try {
        const response = await repository.getTeamMembers(req.query);
        res.status(200).json({
            success: true,
            data: response,
            message: `Team Members`,
        });
    } catch (error) {
        next(error)
    }
})

router.post('/delete-team', async (req, res, next) => {
    try {
        await repository.deleteTeam(req.body);
        res.status(200).json({
            success: true,
            message: `Successfully deleted`,
        });
    } catch (error) {
        next(error);
    }
})
module.exports = router;