const OtpEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .otp-container {
            background-color: #f0f8ff;
            border: 1px solid #007bff;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 8px;
            background-color: #e6f2ff;
            padding: 15px;
            border-radius: 5px;
            display: inline-block;
            margin: 15px 0;
        }
        .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2 style="color: #007bff; text-align: center;">Verify Your Account</h2>

        <p>Hello {firstName},</p>

        <p>We noticed a request to verify your account. To ensure the security of your account, please use the One-Time Password (OTP) below:</p>

        <div class="otp-container">
            <p>Your Verification Code:</p>
            <div class="otp-code">{otp}</div>
            <p>This is a secure code to verify your identity.</p>
        </div>

        <p>If you did not request this verification, please ignore this email or contact our support team if you have any concerns.</p>

        <p>Best regards,<br>Chatly</p>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;

const LoginOtpEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .otp-container {
            background-color: #f0f8ff;
            border: 1px solid #007bff;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 8px;
            background-color: #e6f2ff;
            padding: 15px;
            border-radius: 5px;
            display: inline-block;
            margin: 15px 0;
        }
        .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2 style="color: #007bff; text-align: center;">Welcome Back, {firstName}!</h2>

        <p>Hey there! Great to see you trying to log in.</p>

        <p>To make sure it's really you, please use the One-Time Password (OTP) below to quickly access your account:</p>

        <div class="otp-container">
            <p>Your Quick Access Code:</p>
            <div class="otp-code">{otp}</div>
            <p>Just one more step to get back to what you were doing!</p>
        </div>

        <p>If you didn't request this login, no worries! Just ignore this email or reach out to our support team if you have any concerns.</p>

        <p>Cheers,<br>Your Friendly Chatly.</p>

        <div class="footer">
            <p>This is an automated message to keep your account secure. Enjoy!</p>
        </div>
    </div>
</body>
</html>`;

module.exports = { OtpEmailTemplate, LoginOtpEmailTemplate };
