const Alert = require('../models/Alert');
const nodemailer = require('nodemailer');
const axios = require('axios');

// ==========================================
// 1. GMAIL API INTEGRATION
// ==========================================
const createGmailTransporter = () => {
  // To use this, the user must provide their Gmail and App Password in .env
  // e.g., GMAIL_USER=myemail@gmail.com, GMAIL_APP_PASSWORD=abcd1234
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return null;
};

// Fallback to Ethereal for testing if Gmail keys are not provided
const createFallbackTransporter = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    return null;
  }
};

// ==========================================
// 2. WHATSAPP META CLOUD API INTEGRATION
// ==========================================
const sendWhatsAppMessage = async (phone, busNumber) => {
  // Requires META_WHATSAPP_TOKEN and META_PHONE_NUMBER_ID in .env
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(`[WHATSAPP API DISABLED] Setup .env with META keys to send real message to ${phone}`);
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone.replace(/[^0-9]/g, ''), // Clean phone number
        type: 'template',
        template: {
          name: 'bus_alert_activation',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: busNumber || 'General Updates' }
              ]
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Real-time WhatsApp sent to ${phone} via Meta API.`);
  } catch (error) {
    console.error('Meta WhatsApp API Error:', error?.response?.data || error.message);
  }
};

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Public
exports.createAlert = async (req, res) => {
  try {
    const { email, phone, busNumber, route, emailAlerts, whatsappAlerts, smsAlerts } = req.body;

    const alert = await Alert.create({
      email,
      phone,
      busNumber,
      route,
      emailAlerts,
      whatsappAlerts,
      smsAlerts
    });

    let emailUrl = null;

    if (email && emailAlerts) {
      try {
        let transporter = createGmailTransporter();
        let isFallback = false;

        if (!transporter) {
          transporter = await createFallbackTransporter();
          isFallback = true;
          console.log("[GMAIL API DISABLED] Falling back to test Ethereal email. Provide GMAIL_USER and GMAIL_APP_PASSWORD to send real emails.");
        }

        if (transporter) {
          const info = await transporter.sendMail({
            from: process.env.GMAIL_USER ? `Punjab Bus Tracking <${process.env.GMAIL_USER}>` : '"Punjab Bus Tracking" <alerts@punjabbustracking.in>',
            to: email,
            subject: `Smart Alert Active: ${busNumber || 'General'}`,
            text: `Hello! Your Smart Alert has been activated for ${busNumber ? busNumber : 'Bus Tracking'}. You will receive live updates.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: #3b82f6; padding: 20px; text-align: center; color: white;">
                  <h2>🚌 Punjab Bus Tracking</h2>
                </div>
                <div style="padding: 20px;">
                  <h3>Hello!</h3>
                  <p>Your Smart Alert has been successfully activated for <strong>${busNumber ? busNumber : 'Bus Tracking'}</strong>.</p>
                  <p>Route: ${route || 'All Routes'}</p>
                  <p>You will now receive real-time updates regarding this vehicle's ETA and status.</p>
                </div>
              </div>
            `,
          });
          
          if (isFallback) {
            emailUrl = nodemailer.getTestMessageUrl(info);
            console.log("Real-time Email sent via Ethereal: %s", info.messageId);
            console.log("Preview URL: %s", emailUrl);
          } else {
            console.log("Real-time Gmail sent successfully to:", email);
          }
        }
      } catch (emailErr) {
        console.error("Error sending email:", emailErr);
      }
    }

    if (phone && whatsappAlerts) {
      await sendWhatsAppMessage(phone, busNumber);
    }

    res.status(201).json({
      success: true,
      data: alert,
      message: 'Alert saved and notifications queued successfully.',
      emailPreviewUrl: emailUrl
    });
  } catch (error) {
    console.error("Create alert error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
