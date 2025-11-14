'use server';

/**
 * @fileOverview Generates a browser notification payload based on user environmental parameters.
 *
 * - generateNotificationPayload - A function that generates the notification payload.
 * - NotificationPayloadInput - The input type for the generateNotificationPayload function.
 * - NotificationPayloadOutput - The return type for the generateNotificationPayload function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotificationPayloadInputSchema = z.object({
  browserType: z.string().describe('The type of the user\'s browser (e.g., Chrome, Firefox, Safari).'),
  browserVersion: z.string().describe('The version of the user\'s browser.'),
  osName: z.string().describe('The name of the user\'s operating system (e.g., Windows, macOS, Linux).'),
  osVersion: z.string().describe('The version of the user\'s operating system.'),
  message: z.string().describe('The message to display in the notification.'),
  title: z.string().describe('The title of the notification.'),
  iconUrl: z.string().describe('URL for the notification icon.'),
});
export type NotificationPayloadInput = z.infer<typeof NotificationPayloadInputSchema>;

const NotificationPayloadOutputSchema = z.object({
  payload: z.string().describe('A JSON string containing the notification payload, formatted for the specific browser and OS.'),
});
export type NotificationPayloadOutput = z.infer<typeof NotificationPayloadOutputSchema>;

export async function generateNotificationPayload(input: NotificationPayloadInput): Promise<NotificationPayloadOutput> {
  return notificationPayloadFlow(input);
}

const notificationPayloadPrompt = ai.definePrompt({
  name: 'notificationPayloadPrompt',
  input: {schema: NotificationPayloadInputSchema},
  output: {schema: NotificationPayloadOutputSchema},
  prompt: `You are a browser notification expert. Given the user's environment,
  craft a JSON payload that can be used to trigger a browser notification.

  User Environment:
  Browser Type: {{{browserType}}}
  Browser Version: {{{browserVersion}}}
  Operating System: {{{osName}}} {{{osVersion}}}

  Notification Content:
  Title: {{{title}}}
  Message: {{{message}}}
  Icon URL: {{{iconUrl}}}

  Ensure the payload is a valid JSON string and includes all necessary configurations
  for the notification to display correctly. Consider browser-specific requirements
  and OS-level settings.

  Example Payload (Chrome on Windows):
  {
    "title": "Time Capsule Unlocked!",
    "body": "Your message is now available.",
    "icon": "https://example.com/icon.png"
  }
  Return ONLY the JSON payload string.  Do not include any other text.
  `,
});

const notificationPayloadFlow = ai.defineFlow(
  {
    name: 'notificationPayloadFlow',
    inputSchema: NotificationPayloadInputSchema,
    outputSchema: NotificationPayloadOutputSchema,
  },
  async input => {
    const {output} = await notificationPayloadPrompt(input);
    return output!;
  }
);
