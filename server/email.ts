import { Resend } from 'resend';
import { storage } from './storage';
import type { TourRequest } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTourRequestNotification(tourRequest: TourRequest) {
  try {
    const activeRecipients = await storage.getEmailRecipients(true);
    
    if (activeRecipients.length === 0) {
      console.log('No active email recipients configured for tour request notifications');
      return;
    }

    const emailContent = `
      <h2>New Tour Request Received</h2>
      <p>A new tour request has been submitted with the following details:</p>
      
      <h3>Contact Information</h3>
      <ul>
        <li><strong>Name:</strong> ${tourRequest.name}</li>
        <li><strong>Email:</strong> ${tourRequest.email || 'Not provided'}</li>
        <li><strong>Phone:</strong> ${tourRequest.phone}</li>
      </ul>
      
      ${tourRequest.communityId ? `<p><strong>Community of Interest:</strong> ${tourRequest.communityId}</p>` : ''}
      ${tourRequest.preferredDate ? `<p><strong>Preferred Date:</strong> ${new Date(tourRequest.preferredDate).toLocaleDateString()}</p>` : ''}
      ${tourRequest.message ? `<p><strong>Message:</strong> ${tourRequest.message}</p>` : ''}
      
      <p><strong>Submitted:</strong> ${new Date(tourRequest.createdAt || Date.now()).toLocaleString()}</p>
    `;

    const recipients = activeRecipients.map(r => r.email);
    
    const { data, error } = await resend.emails.send({
      from: 'Stage Senior <notifications@resend.dev>',
      to: recipients,
      subject: `New Tour Request from ${tourRequest.name}`,
      html: emailContent,
    });

    if (error) {
      console.error('Error sending tour request notification:', error);
      throw error;
    }

    console.log('Tour request notification sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send tour request notification:', error);
    throw error;
  }
}
