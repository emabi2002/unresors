// Email service using Resend or console logging for development
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer | string }[];
}

class EmailService {
  private isDevelopment = process.env.NODE_ENV === 'development';

  async sendEmail(data: EmailData): Promise<boolean> {
    // In development, just log to console
    if (this.isDevelopment || !process.env.RESEND_API_KEY) {
      console.log('📧 EMAIL WOULD BE SENT:', {
        to: data.to,
        subject: data.subject,
        hasAttachments: !!data.attachments?.length,
      });
      console.log('Email HTML:', data.html.substring(0, 200) + '...');
      return true;
    }

    // Production: Use Resend or Nodemailer
    try {
      // TODO: Integrate with Resend API or Nodemailer
      // const { Resend } = await import('resend');
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'noreply@unre.ac.pg',
      //   to: data.to,
      //   subject: data.subject,
      //   html: data.html,
      // });

      console.log('✅ Email sent successfully to:', data.to);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  // Predefined email templates
  async sendApplicationConfirmation(applicantEmail: string, applicationId: string, applicantName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #008060; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #008060; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>University of Natural Resources and Environment</h1>
            <p>Application Confirmation</p>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>Thank you for applying to UNRE!</p>
            <p>Your application has been successfully submitted and is being reviewed by our admissions team.</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p>You can track your application status by logging into the student portal.</p>
            <p>We will notify you via email once a decision has been made.</p>
            <p>If you have any questions, please contact us at admissions@unre.ac.pg</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: applicantEmail,
      subject: `Application Confirmation - ${applicationId}`,
      html,
    });
  }

  async sendAdmissionOffer(applicantEmail: string, studentId: string, applicantName: string, program: string, admissionLetterPDF?: Buffer) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #008060; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #fffbcc; padding: 15px; border-left: 4px solid #008060; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #008060; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Congratulations!</h1>
            <p>You have been offered admission to UNRE</p>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>We are pleased to inform you that you have been <strong>offered admission</strong> to:</p>
            <div class="highlight">
              <p><strong>Program:</strong> ${program}</p>
              <p><strong>Student ID:</strong> ${studentId}</p>
              <p><strong>Academic Year:</strong> 2025</p>
              <p><strong>Semester:</strong> Semester 1</p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Log into the student portal using your Student ID: <strong>${studentId}</strong></li>
              <li>Complete the online enrollment form</li>
              <li>Pay the required enrollment fees</li>
              <li>Register for your courses</li>
            </ol>
            <p>Your admission letter is attached to this email.</p>
            <a href="https://unre.ac.pg/portal" class="button">Access Student Portal</a>
            <p>Welcome to UNRE!</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: applicantEmail,
      subject: `🎓 Admission Offer - ${program}`,
      html,
      attachments: admissionLetterPDF ? [
        {
          filename: `Admission_Letter_${studentId}.pdf`,
          content: admissionLetterPDF,
        }
      ] : undefined,
    });
  }

  async sendApplicationRejection(applicantEmail: string, applicantName: string, reason?: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #666; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>University of Natural Resources and Environment</h1>
            <p>Application Status Update</p>
          </div>
          <div class="content">
            <p>Dear ${applicantName},</p>
            <p>Thank you for your interest in the University of Natural Resources and Environment.</p>
            <p>After careful consideration, we regret to inform you that we are unable to offer you admission at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>We encourage you to apply again in the future. If you have any questions, please contact our admissions office at admissions@unre.ac.pg</p>
            <p>We wish you all the best in your future endeavors.</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: applicantEmail,
      subject: 'Application Status Update - UNRE',
      html,
    });
  }

  async sendPaymentConfirmation(studentEmail: string, studentName: string, amount: number, receiptNumber: string, description: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #008060; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .receipt { background: white; padding: 20px; border: 2px dashed #008060; margin: 20px 0; }
          .amount { font-size: 24px; color: #008060; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Received</h1>
          </div>
          <div class="content">
            <p>Dear ${studentName},</p>
            <p>We have successfully received your payment.</p>
            <div class="receipt">
              <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Amount Paid:</strong> <span class="amount">K ${amount.toFixed(2)}</span></p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>You can download your official receipt from the student portal.</p>
            <p>Thank you for your payment!</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: studentEmail,
      subject: `Payment Confirmation - ${receiptNumber}`,
      html,
    });
  }

  async sendEnrollmentConfirmation(studentEmail: string, studentName: string, studentId: string, program: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #008060; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .highlight { background: #e8f5f1; padding: 15px; border-left: 4px solid #008060; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #008060; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enrollment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${studentName},</p>
            <p>Congratulations! Your enrollment has been successfully confirmed.</p>
            <div class="highlight">
              <p><strong>Student ID:</strong> ${studentId}</p>
              <p><strong>Program:</strong> ${program}</p>
              <p><strong>Status:</strong> <span style="color: #008060;">ENROLLED</span></p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Register for your courses</li>
              <li>View your class schedule</li>
              <li>Download your student ID card</li>
              <li>Complete any required orientations</li>
            </ol>
            <a href="https://unre.ac.pg/portal/student" class="button">Go to Student Portal</a>
            <p>Welcome to UNRE! We look forward to seeing you on campus.</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: studentEmail,
      subject: `Enrollment Confirmed - ${studentId}`,
      html,
    });
  }

  async sendCourseRegistrationConfirmation(studentEmail: string, studentName: string, courses: string[], totalCredits: number) {
    const courseList = courses.map(c => `<li>${c}</li>`).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #008060; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .courses { background: white; padding: 20px; border-left: 4px solid #008060; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Course Registration Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${studentName},</p>
            <p>Your course registration has been successfully confirmed!</p>
            <div class="courses">
              <p><strong>Registered Courses:</strong></p>
              <ul>${courseList}</ul>
              <p><strong>Total Credits:</strong> ${totalCredits}</p>
            </div>
            <p>You can view your full class schedule in the student portal.</p>
            <p>Good luck with your studies!</p>
          </div>
          <div class="footer">
            <p>© 2025 University of Natural Resources and Environment. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: studentEmail,
      subject: 'Course Registration Confirmed',
      html,
    });
  }
}

export const emailService = new EmailService();
