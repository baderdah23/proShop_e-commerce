import * as crypto from "node:crypto";
import { LoginSchema, UserSchema, newPasswordSchema, profileUpdateSchema } from "./auth.validation.js";
import {
  addUser,
  findUser,
  updatePassword,
  updatePasswordHash,
  updateResetCode,
  updateCurrentUser,
} from "./auth.repository.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const isProduction =
  process.env.NODE_ENV === "production" || !!process.env.VERCEL;
const cookieOption = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "strict") as "none" | "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const sginup = async (req: Request, res: Response) => {
  try {
    const validatedData = UserSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res
        .status(400)
        .json({ success: false, message: validatedData.error });
    }
    const { full_name, phone, password } = validatedData.data;
    const email = validatedData.data.email.trim().toLowerCase();

    const result = await findUser(email);

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "email or password is wrong",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const addToDb = await addUser(full_name, email, phone, hashPassword);
    const token = generateToken(addToDb.user_id);
    res.cookie("token", token, cookieOption);
    const { password: _password, ...safeUser } = addToDb;

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = LoginSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: validatedData.error.issues[0]?.message || "بيانات الدخول غير صالحة.",
      });
    }
    const email = validatedData.data.email.trim().toLowerCase();
    const { password } = validatedData.data;
    const result = await findUser(email);

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "email or password is wrong",
      });
    }

    let passwordMatch = await bcrypt.compare(password, result[0].password);

    // Older seed data used plaintext passwords; upgrade a matching account
    // immediately so future logins use bcrypt without exposing the password.
    if (!passwordMatch && !result[0].password.startsWith("$2")) {
      passwordMatch = result[0].password === password;
      if (passwordMatch) {
        const passwordHash = await bcrypt.hash(password, 10);
        result[0] = await updatePasswordHash(result[0].user_id, passwordHash);
      }
    }

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "email or password is wrong" });
    }
    const token = generateToken(result[0].user_id);
    res.cookie("token", token, cookieOption);
    const { password: _password, ...safeUser } = result[0];
    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "user found successfully",
      user: (req as any).user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const validation = profileUpdateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.error.issues[0]?.message || "بيانات الملف الشخصي غير صالحة.",
    });
  }
  try {
    const userId = (req as any).user.user_id as string;
    const updatedUser = await updateCurrentUser(
      userId,
      validation.data.full_name,
      validation.data.email.trim().toLowerCase(),
      validation.data.phone,
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود." });
    }
    return res.status(200).json({
      success: true,
      message: "تم تحديث الملف الشخصي.",
      user: updatedUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "تعذر تحديث الملف الشخصي.";
    return res.status(400).json({ success: false, message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", cookieOption);
    return res.status(200).json({
      success: true,
      message: "logged out successfully ",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const result = await findUser(email);
    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "something email wrong",
      });
    }

    const resetCode = crypto.randomInt(100000, 1000000).toString();

    const resetCodeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const queryResult = await updateResetCode(resetCodeHash, expiresAt, email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
      <!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>إعادة تعيين كلمة المرور</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#F8FAFC;font-family:'Rubik','Segoe UI',Tahoma,sans-serif;color:#1A1D2A;padding:32px 16px}
.preheader{display:none}
.card{width:100%;max-width:560px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,.10);padding:40px 36px;text-align:center}
.badge{width:64px;height:64px;line-height:64px;margin:0 auto 20px;border-radius:16px;background-color:#2B7BD4;background-image:linear-gradient(135deg,#6AABF0,#2B7BD4);box-shadow:0 4px 24px rgba(106,171,240,.35)}
.badge svg{vertical-align:middle}
h1{font-size:22px;font-weight:700;color:#1A1D2A}
.eyebrow{margin-top:6px;font-family:'Outfit','Rubik',sans-serif;font-size:11px;font-weight:600;letter-spacing:3px;color:#94A3B8}
.msg{margin-top:24px;font-size:15px;line-height:1.9;color:#475569}
.code-card{margin:28px 0;padding:26px 20px;border-radius:12px;background-color:#1A2F4A;background-image:linear-gradient(160deg,#1A2F4A,#0D1B2A);border:1px solid rgba(106,171,240,.30)}
.code-label{font-size:12px;font-weight:500;color:#94A3B8}
.code{margin-top:10px;font-family:'Outfit','Rubik',sans-serif;font-size:36px;font-weight:800;letter-spacing:10px;color:#fff;direction:ltr}
.timer{display:inline-block;padding:9px 16px;border-radius:12px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.30);font-size:13px;font-weight:500;color:#D97706}
.timer svg{vertical-align:middle;margin-left:8px}
.note{margin-top:24px;font-size:13px;line-height:1.8;color:#94A3B8}
.divider{height:1px;background:#E2E8F0;margin:28px 0 20px}
.team{font-size:13px;line-height:1.8;color:#64748B}
.footer{width:100%;max-width:560px;margin:16px auto 0;text-align:center;font-size:12px;color:#94A3B8;line-height:1.7}
@media(max-width:480px){.card{padding:32px 20px}.code{font-size:30px;letter-spacing:7px}}
</style>
</head>
<body>
<div class="preheader">رمز التحقق لإعادة تعيين كلمة المرور</div>
<div class="card">
  <div class="badge"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
  <h1>إعادة تعيين كلمة المرور</h1>
  <div class="eyebrow">PASSWORD RESET</div>
  <p class="msg">مرحباً،<br>طلبت إعادة تعيين كلمة المرور لحسابك.<br>استخدم الرمز التالي للتحقق من هويتك:</p>
  <div class="code-card">
    <div class="code-label">رمز التحقق</div>
    <div class="code">${resetCode}</div>
  </div>
  <div class="timer"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>صالح لمدة 10 دقائق</div>
  <p class="note">إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
  <div class="divider"></div>
  <p class="team">شكراً لك،<br>فريق التطبيق</p>
</div>
<p class="footer">هذه رسالة آلية مُرسلة تلقائياً، يرجى عدم الرد عليها.</p>
</body>
</html>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).json({ success: false, message: error });
      }
      return res.status(200).json({
        success: true,
        message: "Reset code sent successfully , please check your email",
      });
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { email, resetCode } = req.body;

    const user = await findUser(email);
    if (!user || !user[0].reset_password_code_hash) {
      return res.status(400).json({
        success: false,
        message: "aomething went wrong",
      });
    }

    const inputCodeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    if (inputCodeHash !== user[0].reset_password_code_hash) {
      return res.status(400).json({
        success: false,
        message: "wrong reset code",
      });
    }

    const currentTime = new Date();
    const expiryTime = new Date(user[0].reset_password_code_expires_at);

    if (currentTime > expiryTime) {
      await updateResetCode(null, null, email);

      return res.status(400).json({
        success: false,
        message: "reset code has expired , please request new reset code",
      });
    }

    return res.status(200).json({
      success: true,
      message: "rest code is valid",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validateData = newPasswordSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        success: false,
        message: validateData.error.issues[0].message,
      });
    }

    const { email, password, resetCode } = validateData.data;

    const result = await findUser(email);
    const user = result[0];

    if (!user || !user.reset_password_code_hash) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or reset code has expired.",
      });
    }

    const inputCodeHash = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    if (inputCodeHash !== user.reset_password_code_hash) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.reset_password_code_expires_at);

    if (currentTime > expiryTime) {
      await updateResetCode(null, null, email);

      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new one.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const queryResult = await updatePassword(email, hashPassword);

    await updateResetCode(null, null, email);

    if (queryResult) {
      return res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
