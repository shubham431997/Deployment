import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MS_EMAIL,
        pass: process.env.MS_PASS,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMail = async (mailOptions) => {
    return await transporter.sendMail({
        from: `"SaraFoods" <${process.env.EMAIL}>`,
        ...mailOptions,
    });
};

export function getEmailTemplate(templateName, data) {
    const filePath = path.join(__dirname, '../template', templateName);
    let template = fs.readFileSync(filePath, 'utf8');

    // Preserve existing OTP functionality
    if (data.otp) {
        template = template.replace('{{otp}}', data.otp);
    }

    // Replace other placeholders dynamically (for feedback emails)
    Object.keys(data).forEach((key) => {
        template = template.replace(`{{${key}}}`, data[key]);
    });

    return template;
}

// Function to send feedback email to user and admin
export const sendFeedbackMail = async (userEmail, userName, accountDeletionReason, feedback) => {
    try {
        // Email to user
        const userTemplate = getEmailTemplate('feedback_user.html', { name: userName, accountDeletionReason, feedback });
        await sendMail({
            to: userEmail,
            subject: 'We received your account deletion request',
            html: userTemplate,
        });

        // Email to admin
        const adminTemplate = getEmailTemplate('feedback_admin.html', { name: userName, email: userEmail, accountDeletionReason, feedback });
        await sendMail({
            to: process.env.ADMIN_EMAIL,
            subject: 'Account Deletion Request',
            html: adminTemplate,
        });

    } catch (error) {
        console.error('Error sending feedback emails:', error);
        throw error;
    }
};
