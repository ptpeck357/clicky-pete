import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.AWS_REGION });

// Your verified email address in SES
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || TO_EMAIL;

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event) => {
	// Handle CORS preflight
	if (event.requestContext?.http?.method === 'OPTIONS') {
		return { statusCode: 200, headers: corsHeaders, body: '' };
	}

	try {
		const body = JSON.parse(event.body || '{}');
		const { name, email, subject, message } = body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return {
				statusCode: 400,
				headers: corsHeaders,
				body: JSON.stringify({ error: 'All fields are required' }),
			};
		}

		// Basic email validation
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return {
				statusCode: 400,
				headers: corsHeaders,
				body: JSON.stringify({ error: 'Invalid email address' }),
			};
		}

		const emailParams = {
			Source: FROM_EMAIL,
			Destination: {
				ToAddresses: [TO_EMAIL],
			},
			ReplyToAddresses: [email],
			Message: {
				Subject: {
					Data: `Portfolio Contact: ${subject}`,
					Charset: 'UTF-8',
				},
				Body: {
					Text: {
						Data: `New message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
						Charset: 'UTF-8',
					},
					Html: {
						Data: `
							<h2>New message from your portfolio website</h2>
							<p><strong>Name:</strong> ${escapeHtml(name)}</p>
							<p><strong>Email:</strong> ${escapeHtml(email)}</p>
							<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
							<hr />
							<p><strong>Message:</strong></p>
							<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
						`,
						Charset: 'UTF-8',
					},
				},
			},
		};

		await ses.send(new SendEmailCommand(emailParams));

		return {
			statusCode: 200,
			headers: corsHeaders,
			body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
		};
	} catch (error) {
		console.error('Error sending email:', error);
		return {
			statusCode: 500,
			headers: corsHeaders,
			body: JSON.stringify({ error: 'Failed to send email' }),
		};
	}
};

function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return text.replace(/[&<>"']/g, (char) => map[char]);
}
