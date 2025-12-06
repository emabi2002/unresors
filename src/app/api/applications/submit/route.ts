import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    // Generate application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Insert application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        application_id: applicationId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        nationality: data.nationality,
        national_id: data.national_id,
        marital_status: data.marital_status,
        religion: data.religion,
        province: data.province,
        district: data.district,
        village: data.village,
        postal_address: data.postal_address,
        residing_province: data.residing_province,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_relationship: data.emergency_contact_relationship,
        emergency_contact_phone: data.emergency_contact_phone,
        program_id: data.program_id,
        grade_12_school: data.grade_12_school,
        grade_12_year: data.grade_12_year,
        grade_12_marks: data.grade_12_marks || 0,
        matriculation_centre: data.matriculation_centre,
        slf_number: data.slf_number,
        nearest_airport: data.nearest_airport,
        resident_type: data.resident_type,
        sponsor: data.sponsor,
        grade_12_certificate: data.grade_12_certificate,
        academic_transcript: data.academic_transcript,
        national_id_document: data.national_id_document,
        passport_photo: data.passport_photo,
        amount_paid: data.amount_paid || 0,
        receipt_number: data.receipt_number,
        declaration_agreed: data.declaration_agreed,
        signature: data.signature,
        witness: data.witness,
        application_status: 'submitted',
        application_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to submit application' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email to applicant
    // TODO: Send notification to admissions staff

    return NextResponse.json({
      success: true,
      applicationId: applicationId,
      message: 'Application submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
