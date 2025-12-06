import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { applicationId, reason, rejectedBy } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Fetch application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'rejected',
        rejected_date: new Date().toISOString(),
        rejected_by: rejectedBy,
        rejection_reason: reason || 'Application does not meet admission requirements',
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Application update error:', updateError);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Send rejection email
    await emailService.sendApplicationRejection(
      application.email,
      `${application.first_name} ${application.last_name}`,
      reason
    );

    return NextResponse.json({
      success: true,
      message: 'Application rejected and notification sent',
    });
  } catch (error: any) {
    console.error('Rejection error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
