// utils/sendWhatsApp.js
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Sends a booking confirmation over WhatsApp via Twilio.
// `phone` is the 10-digit Indian mobile number your app already collects —
// Twilio needs the full international format, so we prepend +91 here.
const sendBookingWhatsApp = async ({ phone, fullName, eventName, eventDate, bookingId, totalAmount }) => {
  const message = `Hi ${fullName}, your booking with Eventura is confirmed! 🎉

Booking ID: ${bookingId}
Event: ${eventName}
Date: ${new Date(eventDate).toLocaleDateString("en-IN")}
Total Amount: ₹${totalAmount.toLocaleString("en-IN")}

Our team will reach out with further details soon. Thank you for choosing Eventura!`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:+91${phone}`,
    body: message,
  });
};

module.exports = sendBookingWhatsApp;