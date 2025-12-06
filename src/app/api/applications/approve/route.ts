import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';
import { PDFGenerator, type AdmissionLetterData } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { applicationId, approvedBy } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    // Fetch application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        programs (
          id,
          program_name,
          program_code,
          degree_level,
          school_id,
          department_id
        )
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Generate Student ID (format: STU-2025-XXX)
    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    const studentNumber = String((count || 0) + 1).padStart(4, '0');
    const studentId = `STU-2025-${studentNumber}`;
    const academicYear = '2025';
    const semester = 'Semester 1';

    // Create user account
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: application.email,
        first_name: application.first_name,
        last_name: application.last_name,
        phone: application.phone,
        role: 'student',
        is_active: true,
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        id: user.id,
        student_id: studentId,
        program_id: application.program_id,
        enrollment_status: 'admitted',
        admission_date: new Date().toISOString(),
        academic_year: academicYear,
        current_semester: semester,
        current_year_level: 1,
        // Transfer application data to student record
        date_of_birth: application.date_of_birth,
        gender: application.gender,
        nationality: application.nationality,
        national_id: application.national_id,
        marital_status: application.marital_status,
        religion: application.religion,
        province: application.province,
        district: application.district,
        home_address: application.village,
        emergency_contact_name: application.emergency_contact_name,
        emergency_contact_phone: application.emergency_contact_phone,
        emergency_contact_relationship: application.emergency_contact_relationship,
        secondary_school: application.grade_12_school,
        grade_12_results: application.grade_12_marks || 0,
        nearest_airport: application.nearest_airport,
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      // Rollback user creation
      await supabase.from('users').delete().eq('id', user.id);
      return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 });
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'approved',
        approved_date: new Date().toISOString(),
        approved_by: approvedBy,
        student_id_generated: studentId,
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Application update error:', updateError);
    }

    // Generate admission letter PDF
    const admissionData: AdmissionLetterData = {
      studentName: `${application.first_name} ${application.last_name}`,
      studentId: studentId,
      program: application.programs.program_name,
      programCode: application.programs.program_code,
      degreeLevel: application.programs.degree_level,
      admissionDate: new Date().toLocaleDateString(),
      academicYear: academicYear,
      semester: semester,
      campus: 'Main Campus',
    };

    const admissionLetterPDF = PDFGenerator.generateAdmissionLetter(admissionData);
    const pdfBuffer = Buffer.from(admissionLetterPDF.output('arraybuffer'));

    // Upload admission letter to storage
    const letterFileName = `admission-letters/${studentId}_admission_letter.pdf`;
    await supabase.storage
      .from('documents')
      .upload(letterFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    // Send admission email
    await emailService.sendAdmissionOffer(
      application.email,
      studentId,
      `${application.first_name} ${application.last_name}`,
      application.programs.program_name,
      pdfBuffer
    );

    // Create initial invoice for enrollment fees
    const { data: feeStructure } = await supabase
      .from('fee_structures')
      .select('*')
      .eq('program_id', application.program_id)
      .eq('academic_year', academicYear)
      .single();

    if (feeStructure) {
      const totalAmount = parseFloat(feeStructure.tuition_fee || 0) +
                         parseFloat(feeStructure.compulsory_fees || 0) +
                         parseFloat(feeStructure.boarding_fee || 0);

      await supabase.from('invoices').insert({
        student_id: user.id,
        invoice_number: `INV-${academicYear}-${studentNumber}`,
        academic_year: academicYear,
        semester: semester,
        total_amount: totalAmount,
        amount_paid: 0,
        balance: totalAmount,
        due_date: '2025-02-28',
        status: 'pending',
        generated_by: approvedBy || user.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Application approved successfully',
      studentId: studentId,
      userId: user.id,
      email: application.email,
    });
  } catch (error: any) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
