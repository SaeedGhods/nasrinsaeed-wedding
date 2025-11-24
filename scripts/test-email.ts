import { sendInvitation } from '../lib/sendEmail';

async function test() {
  try {
    await sendInvitation('saeedghods@me.com', 'Test1234', 'Saeed');
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

test();

