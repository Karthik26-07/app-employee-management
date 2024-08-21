import * as yup from "yup";

export const LoginSchema = yup.object().shape({
    email: yup.string().email("Enter valid email address").required("Email is required"),
    password: yup.string().required("Password is required"),
});

export const UserSchema = yup.object().shape({
    name: yup.string().min(3, "Invalid Name"),
    user_type: yup.string().required("Please select user role"),
    email: yup.string().email().required("Email is required"),
    contact: yup.string().length(10, "Invalid contact number"),
    address: yup.string().min(10, "Please enter valid address"),
    is_active: yup.boolean().optional().default(false),
});

export const TeamSchema = yup.object().shape({
    team_lead: yup.string().required("Please select team lead"),
    name: yup.string().min(3, "Invalid Team Name"),
    description: yup.string().min(10, "Description should contain at least 10 words"),
})

export const SalarySchema = yup.object().shape({
    basic: yup.number().required("Basic salary is required"),
    da: yup.number().required("Da is required"),
    ta: yup.number().required("Ta is required"),
    gross_salary: yup.number().required("Gross Salary is required"),
})

export const LeaveSchema = yup.object().shape({
    sl: yup.number().required("Sick leave is required"),
    cl: yup.number().required("Casual leave is required"),
});

export const TaskSchema = yup.object().shape({
    member_id: yup.string().required("Please select team member"),
    task_title: yup.string().min(3, "Please enter valid task title").required("Task title is required"),
    task_description: yup.string().min(10, "Please enter valid task description").required("Task description is required"),
    end_date: yup.string("Please select the end date").required("End date is required"),
    // status: yup.string().required("Please select status").default("Not Started"),
});

export const LeaveApplicationSchema = yup.object().shape({
    leave_type: yup.string().required("Please select leave type"),
    start_date: yup.string().required("Please select start date"),
    end_date: yup.string().required("Please select end date"),
    description: yup.string().optional(),
})


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ProfileSchema = yup.object().shape({
    image: yup.mixed()
        .test('fileSize', 'File size is too large (max 5MB)', async (value) => {
            if (!value || value.length === 0) return true; // File is optional
            return await value[0].size <= MAX_FILE_SIZE;
        })
        .test('fileType', 'Unsupported file type', async (value) => {
            if (!value || value.length === 0) return true; // File is optional
            return await value[0]?.type?.startsWith('image/');
        })
        .nullable()
        .optional(),
    contact: yup.string().length(10, "Invalid contact number"),
    address: yup.string().min(10, "Please enter valid address"),
    password: yup.string().optional(),
});