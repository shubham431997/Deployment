import bcrypt from "bcryptjs";
import { ROLE } from "../utils/role.js";
import userService from "../services/user.service.js";
import { statusCode } from "../utils/statusCode.js";
import { sendMail, getEmailTemplate } from "../utils/mail.js";


class UserController {

    async admin (req, res) {
        const { name, phone, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const data = { name, phone, email, password: hashPassword, role: ROLE.ADMIN }
        try {
            const result = await userService.save(data);
            return res.status(result.status).json({ status: result.status, message: result.message, user: result.data });
        } catch (error) {
            return res.status(error.status).json({ status: error.status, error: error.message });
        }
    }

    async user (req, res) {
        const { name, phone, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const data = { name, phone, email, password: hashPassword, role: ROLE.USER }
        try {
            const result = await userService.save(data);
            return res.status(result.status).json({ message: result.message, user: result.data })
        } catch (error) {
            return res.status(error.status).json({ error: error.message });
        }
    }

    async login (req, res) {
        try {
            const result = await userService.login(req.body);
            res.cookie("access_token", result.data, { httpOnly: true });
            
            const emailTemplate = getEmailTemplate("login_alert.html", { 
                name: result.data.name, 
                email: result.data.email, 
                loginTime: new Date().toLocaleString('en-US', { 
                   timeZone: 'Asia/Kolkata',  // Change according to your preferred timezone
                   weekday: 'long', 
                   year: 'numeric', 
                   month: 'long', 
                   day: 'numeric', 
                   hour: '2-digit', 
                   minute: '2-digit', 
                   second: '2-digit' 
                })
            });

            await sendMail({
                to: result.data.email,
                subject: "Login Alert - SaraFoods",
                html: emailTemplate,
            });
            return res.status(result.status).json({ message: result.message, user: result.data });
        } catch (error) {
            return res.status(error.status || statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const result = await userService.update(req.params.id, req.body);
            if (result.status !== statusCode.OK) {
                return res.status(result.status).json({ message: result.message });
            }
            return res.status(result.status).json({ message: result.message, user: result.data });
        } catch (error) {
            return res.status(error.status).json({ error: error.message }); 
        }
    }

    async remove(req, res) {
        try {
            const result = await userService.remove(req.params.id);
            if(result.status !== statusCode.OK)
                return res.status(result.status).json({ message : result.message});
            return res.status(result.status).json({ message: result.message });
        } catch (error) {
            return res.status(error.status).json({ error: error.message });
        }
    }

    async getAllUsers(req,res){
        try {
            const result = await userService.getAllUsers();
            return res.status(result.status).json({ message: result.message, user: result.data });
        } catch (error) {
            return res.status(error.status).json({ error: error.message });
        }
      }

      async sendOtp  (req, res) {
        const { email } = req.body;
        try {
            const response = await userService.sendOtpToEmail(email);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(error.status).json({ error: error.message }); 
        }
    };
    
    async verifyOtp  (req, res)  {
        const { email, otp } = req.body;
        try {
            const response = await userService.verifyOtp(email, otp);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(error.status).json({ error: error.message }); 
        }
    };
    
    async resetPassword (req, res) {
        const { email, password } = req.body;
       // console.log(req.body)
        const hashPassword = await bcrypt.hash(password, 10);
       // const data ={ email, password: hashPassword}
        try {
            const response = await userService.resetPassword( email, hashPassword);
            return res.status(response.status).json(response);
        } catch (error) {
            return res.status(error.status).json({ error: error.message }); 
        }
    };
    
    async getUserById(req, res){
        const id = req.user.id;
        try {
            const user = await userService.getUserById(id);
            return res.status(user.status).json(user);
            
        } catch (error) {
            return res.status(error.status).json({ error: error.message });
        }
    }
}

export default new UserController();
