import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitation(email: string, passcode: string, firstName: string) {
  const html = `
    <div style="background-color: #fdf2f8; padding: 40px; text-align: center; font-family: 'Open Sans', sans-serif; border-radius: 10px; max-width: 600px; margin: auto;">
      <img src="/hero-walking.jpg" alt="Saeed & Nasrin Walking" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />
      <h1 style="font-family: 'Playfair Display', serif; color: #d4af37; font-size: 36px; margin-bottom: 10px;">You're Invited!</h1>
      <p style="color: #333; font-size: 20px; margin-bottom: 20px;">Dear ${firstName},</p>
      <p style="color: #666; font-size: 16px; margin-bottom: 30px;">We are thrilled to invite you to the wedding of Saeed & Nasrin on March 21, 2026 at 4:00 PM at the Four Seasons Hotel Toronto.</p>
      <p style="color: #333; font-size: 18px; margin-bottom: 20px;">Your unique passcode: <strong>${passcode}</strong></p>
      <a href="https://www.nasrinsaeed.com?passcode=${passcode}" style="background-color: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 18px;">RSVP Now</a>
      <p style="color: #666; font-size: 14px; margin-top: 30px;">We can't wait to celebrate with you! If you have any questions, reply to this email.</p>
      <img src="/hero-running.jpg" alt="Saeed & Nasrin Running" style="max-width: 100%; border-radius: 8px; margin-top: 20px;" />
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'wedding@nasrinsaeed.com',
      to: email,
      subject: 'Invitation to Saeed & Nasrin\'s Wedding',
      html,
    });

    if (error) {
      console.error(error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
