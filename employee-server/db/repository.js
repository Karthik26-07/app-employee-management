const { use } = require('express/lib/router');
const con = require('./db-connect');
const util = require('util');
const { hashPassword } = require('../utils/custom');
class Repository {

    constructor(connection) {
        this.con = connection;
        this.query = util.promisify(this.con.query).bind(this.con);
    }

    // auth block start

    async login({ email }) {
        const query = 'SELECT id,user_type,is_active,image,password FROM users WHERE email = ? ';
        return await this.query(query, [email]);
    }
    // auth block end

    async isEmailExists(email) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const results = await this.query(query, [email]);
        return results[0].count > 0;
    }

    async isContactExists(contact, user_id = null) {
        let query = 'SELECT COUNT(*) as count FROM users WHERE contact = ?';
        let values = [contact];

        if (user_id) {
            query += `AND id != ?`;
            values.push(user_id);
        }

        const results = await this.query(query, values);
        return results[0].count > 0;
    }
    async createUser({ user_type, name, contact, email, address, is_active, password }) {
        const query = 'INSERT INTO users (user_type, name, contact, email, address, password, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';
        const values = [user_type, name, contact, email, address, password, is_active];
        return await this.query(query, values);
    }

    async updateUser({ name, contact, email, address, is_active, id, user_type }) {
        const query = 'UPDATE `users` SET name = ?, contact = ?,email = ?, address = ? ,is_active = ? ,user_type = ? ,updated_at = NOW() WHERE id = ?';
        const values = [name, contact, email, address, is_active, user_type, id];
        return await this.query(query, values);
    }
    async createSalary(user_id) {
        const query = 'INSERT INTO `salary` (user_id,created_at) VALUES(?, NOW())';
        return await this.query(query, [user_id]);
    }
    async createLeave(user_id) {
        const query = 'INSERT INTO `leave`(user_id,created_at) VALUES (?, NOW())';
        return await this.query(query, [user_id]);
    }

    async getAllUsers() {
        const query = 'SELECT * FROM `users` WHERE user_type != ? ORDER BY id DESC;'
        return await this.query(query, ['ADMIN']);
    }

    async getActiveUsers() {
        const query = 'SELECT id,name,email,user_type FROM `users` WHERE user_type != ? AND is_active = ? ORDER BY id DESC;'
        return await this.query(query, ['ADMIN', true]);
    }

    async createTeam({ team_lead, name, description }) {
        const query = 'INSERT INTO team (team_lead,name,description,is_active,created_at) VALUES(?, ?, ?, ?, NOW())';
        const values = [team_lead, name, description, true];
        return await this.query(query, values);
    }

    async createTeamMembers(team_id, team_members) {
        let query = 'INSERT INTO `team_members` (`team_id`, `member_id`,`is_active`,`created_at`) VALUES ';

        const placeholders = [];
        const values = [];

        team_members.forEach(member_id => {
            placeholders.push('(?, ?, ?, NOW())');
            values.push(team_id, member_id, true);
        });
        query += placeholders.join(', ');
        return await this.query(query, values);
    }

    async getTeams(team_id = null) {
        let query = `SELECT t.id AS team_id, 
                            t.name AS team_name, 
                            t.description AS team_description, 
                            tl.name AS team_lead_name,
                            tl.id AS team_lead_id,
                            tl.image AS team_lead_image,
                            tl.email AS team_lead_email,
                            tl.contact AS team_lead_contact,
                            tm.member_id AS member_id,
                            u.name AS member_name,
                            u.image AS member_image,
                            u.contact AS member_contact,
                            u.email AS member_email
                        FROM team t
                        JOIN users tl ON t.team_lead = tl.id
                        JOIN team_members tm ON tm.team_id = t.id
                        JOIN users u ON tm.member_id = u.id  `;
        if (team_id == null) {
            query += `ORDER BY team_id DESC`;
            return await this.query(query, []);
        }
        query += `WHERE team_id = ? ORDER BY team_id DESC`;
        return await this.query(query, [team_id]);

    }

    async salary() {
        const query = `SELECT salary.id,salary.user_id,salary.basic,salary.da,salary.ta,salary.gross_salary,salary.is_active,
                              users.user_type,users.name,users.contact,users.email,users.image
                              FROM salary
                              JOIN users ON users.id = salary.user_id
                              ORDER BY salary.id DESC`;
        return await this.query(query, []);
    }

    async updateSalary({ basic, da, ta, gross_salary, id }) {
        const query = 'UPDATE salary SET basic = ?,da = ?,ta = ?, gross_salary = ? , updated_at = NOW() WHERE id = ?';
        const values = [basic, da, ta, gross_salary, id];
        return await this.query(query, values);
    }

    async leaves() {
        const query = `
                        SELECT leave.id, leave.user_id, leave.sl, leave.cl,leave.total_leaves, leave.is_active,
                            users.user_type, users.name, users.contact, users.email, users.image
                        FROM \`leave\`
                        JOIN users ON users.id = leave.user_id
                        ORDER BY leave.id DESC
                    `;
        return await this.query(query, []);
    }

    async updateLeave({ sl, cl, id }) {
        const query = 'UPDATE `leave` SET sl = ? ,cl = ? , total_leaves = ?, updated_at = NOW() WHERE id = ?';
        const values = [sl, cl, sl + cl, id];
        return await this.query(query, values);
    }

    async getTeamByLead(id, role) {
        if (role == "Admin") {
            const query = 'SELECT id,`name`,`description` FROM `team` WHERE is_active = ? ORDER BY id DESC';
            return await this.query(query, [true]);
        }

        const query = 'SELECT id,`name`,`description` FROM `team` WHERE team_lead = ? AND is_active = ? ORDER BY id DESC';
        return await this.query(query, [id, true]);
    }
    async getTeamMembers({ team_id }) {
        const query = `SELECT \`users\`.id,\`users\`.name FROM team_members 
                       JOIN \`users\` ON \`users\`.id = \`team_members\`.member_id
                       WHERE team_id = ? AND \`team_members\`.is_active = ? `;
        return await this.query(query, [team_id, true]);
    }

    async createTask({ team_id, member_id, task_title, task_description, end_date, status }, userId) {
        const query = `INSERT INTO \`task\`(team_id,lead_id,member_id,task_title,task_description,end_date,\`status\`,created_at) VALUES(?, ?, ?, ?, ?, ?, 'Not Started', NOW())`;
        const values = [team_id, userId, member_id, task_title, task_description, end_date, status];
        return await this.query(query, values);
    }

    async updateTask({ member_id, task_title, task_description, end_date, status, task_id }) {
        const query = 'UPDATE task SET member_id = ?,task_title = ?,task_description = ?,end_date = ?,`status` = ? ,updated_at = NOW() WHERE id = ?';
        const values = [member_id, task_title, task_description, end_date, status, task_id];
        return await this.query(query, values);
    }
    async getTaskByTeam({ team_id, role }, user_id) {
        // Base query to select tasks and associated user details
        let query = `
            SELECT task.id, task.task_title, task.task_description, task.end_date, task.status, task.created_at,
                   users.id AS user_id, users.name, users.image, users.email
            FROM task
        `;

        // Conditionally join with users table based on role
        if (role === "TEAM_LEAD") {
            query += `
                JOIN users ON users.id = task.member_id 
                WHERE task.team_id = ? AND task.lead_id = ? 
                ORDER BY task.id DESC
            `;
            // Execute the query with appropriate parameters
            return await this.query(query, [team_id, user_id]);
        } else if (role === "ADMIN") {
            query = `
                SELECT task.id, task.task_title, task.task_description, task.end_date, task.status, task.created_at,
                       users.id AS user_id, users.name, users.image, users.email,
                       t_lead.id AS lead_id, t_lead.name AS lead_name, t_lead.image AS lead_image, t_lead.email AS lead_email
                FROM task
                JOIN users ON users.id = task.member_id 
                JOIN users AS t_lead ON t_lead.id = task.lead_id
                WHERE task.team_id = ? 
                ORDER BY task.id DESC
            `;
            // Execute the query with appropriate parameters
            return await this.query(query, [team_id]);
        } else {
            query += `
                JOIN users ON users.id = task.lead_id 
                WHERE task.team_id = ? AND task.member_id = ? 
                ORDER BY task.id DESC
            `;
            // Execute the query with appropriate parameters
            return await this.query(query, [team_id, user_id]);
        }
    }



    async applyLeave({ leave_type, start_date, end_date, description, status }, userId, total_days) {
        const query = 'INSERT INTO `leave_applications`(`user_id`,`leave_type`,`start_date`,`end_date`,`description`,`status`,`total_days`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';
        const values = [userId, leave_type, start_date, end_date, description, status, total_days];
        return await this.query(query, values);

    }
    async getAppliedLeave(userId) {
        const query = 'SELECT id,leave_type,start_date,end_date,`description`,`status`,total_days FROM leave_applications WHERE user_id = ? ORDER BY id DESC';
        return await this.query(query, [userId]);
    }
    async cancelLeave({ id }) {
        const query = 'DELETE FROM `leave_applications` WHERE id = ?';
        return await this.query(query, [id]);
    }
    async handleLeaveApplication({ id, status }) {
        const query = 'UPDATE leave_applications SET status = ?, updated_at = NOW() WHERE id = ?';
        return await this.query(query, [status, id]);
    }
    async getUser(id) {
        const query = 'SELECT `user_type`,`name`,`contact`,`email`,`address`,`image` FROM `users` WHERE id = ?';
        return await this.query(query, [id]);
    }
    async updateProfile(req) {

        let query = 'UPDATE users SET contact = ?, address = ?';
        let values = [req.body.contact, req.body.address];

        if (req.body.password) {
            const hashedPassword = await hashPassword(req.body.password);
            query += ', password = ?';
            values.push(hashedPassword);
        }

        if (req.file) {
            query += ', image = ?';
            values.push(req.file.path);
        }

        query += ', updated_at = NOW() WHERE id = ?';
        values.push(req.userId);


        return await this.query(query, values);
    }

    async getTeamByMember(userId) {
        const query = `SELECT team.id,team.name,team.description FROM team_members
                        JOIN team ON team.id = team_members.team_id
                        WHERE team_members.member_id = ?`;
        return await this.query(query, [userId]);

    }
    async getLeaveCounts(userId) {
        const query = 'SELECT sl,cl,total_leaves,id FROM `leave` WHERE user_id = ?';
        return await this.query(query, [userId]);
    }
    async getLeaveApplications() {
        const query = `SELECT la.id, la.leave_type,la.start_date,la.end_date,la.total_days,la.description,la.status,
                        users.name,users.email,users.image,users.id as user_id
                        FROM leave_applications AS la
                        JOIN users ON users.id = la.user_id
                        WHERE status = 'Processing'
                        ORDER BY la.id DESC`;
        return await this.query(query, []);
    }
    async updateTaskStatus({ id, status }) {
        const query = "UPDATE task SET `status` = ? ,updated_at = NOW() WHERE id = ?";
        return await this.query(query, [status, id]);
    }
    async deleteTeam({ id }) {
        const query = 'DELETE FROM `team` WHERE id = ?';
        return await this.query(query, [id]);
    }
    async deleteTask({ id }) {
        const query = 'DELETE FROM `task` WHERE id = ?';
        return await this.query(query, [id]);
    }
    async getSalary(userId) {
        const query = 'SELECT basic,da,ta,gross_salary FROM salary WHERE id = ? AND is_active = ?';
        return await this.query(query, [userId, true]);
    }
}

const repository = new Repository(con);
module.exports = repository;
