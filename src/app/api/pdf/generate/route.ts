import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PDFGenerator, type InvoiceData, type ReceiptData, type AdmissionLetterData, type StudentIDData } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { type, id } = await request.json();

    let pdfDoc;
    let filename;

    switch (type) {
      case 'invoice': {
        // Fetch invoice data
        const { data: invoice, error } = await supabase
          .from('invoices')
          .select(`
            *,
            students!student_id (student_id),
            users!students_student_id (first_name, last_name),
            programs!students_program_id (program_name)
          `)
          .eq('id', id)
          .single();

        if (error || !invoice) {
          return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Fetch fee breakdown from fee_structures
        const { data: feeStructure } = await supabase
          .from('fee_structures')
          .select('*')
          .eq('program_id', invoice.students.program_id)
          .eq('academic_year', invoice.academic_year)
          .single();

        const items = [];
        if (feeStructure) {
          if (parseFloat(feeStructure.tuition_fee) > 0) {
            items.push({ description: 'Tuition Fee', amount: parseFloat(feeStructure.tuition_fee) });
          }
          if (parseFloat(feeStructure.compulsory_fees) > 0) {
            items.push({ description: 'Compulsory Fees', amount: parseFloat(feeStructure.compulsory_fees) });
          }
          if (parseFloat(feeStructure.boarding_fee) > 0) {
            items.push({ description: 'Boarding Fee', amount: parseFloat(feeStructure.boarding_fee) });
          }
        }

        const invoiceData: InvoiceData = {
          invoiceNumber: invoice.invoice_number,
          studentId: invoice.students?.student_id || 'N/A',
          studentName: `${invoice.users?.first_name || ''} ${invoice.users?.last_name || ''}`,
          program: invoice.programs?.program_name || 'N/A',
          academicYear: invoice.academic_year,
          semester: invoice.semester,
          items: items.length > 0 ? items : [{ description: 'Fees', amount: parseFloat(invoice.total_amount) }],
          totalAmount: parseFloat(invoice.total_amount),
          amountPaid: parseFloat(invoice.amount_paid),
          balance: parseFloat(invoice.balance),
          dueDate: new Date(invoice.due_date).toLocaleDateString(),
          issueDate: new Date(invoice.created_at).toLocaleDateString(),
        };

        pdfDoc = PDFGenerator.generateInvoice(invoiceData);
        filename = `Invoice_${invoice.invoice_number}.pdf`;
        break;
      }

      case 'receipt': {
        // Fetch payment data
        const { data: payment, error } = await supabase
          .from('payments')
          .select(`
            *,
            students!student_id (student_id),
            users!students_student_id (first_name, last_name),
            programs!students_program_id (program_name),
            invoices!invoice_id (balance)
          `)
          .eq('id', id)
          .single();

        if (error || !payment) {
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        const receiptData: ReceiptData = {
          receiptNumber: payment.receipt_number,
          studentId: payment.students?.student_id || 'N/A',
          studentName: `${payment.users?.first_name || ''} ${payment.users?.last_name || ''}`,
          program: payment.programs?.program_name || 'N/A',
          paymentDate: new Date(payment.payment_date).toLocaleDateString(),
          paymentMethod: payment.payment_method,
          amount: parseFloat(payment.amount),
          description: payment.description || 'Payment',
          balance: parseFloat(payment.invoices?.balance || 0),
        };

        pdfDoc = PDFGenerator.generateReceipt(receiptData);
        filename = `Receipt_${payment.receipt_number}.pdf`;
        break;
      }

      case 'admission_letter': {
        // Fetch student data
        const { data: student, error } = await supabase
          .from('students')
          .select(`
            *,
            users!students_student_id (first_name, last_name),
            programs (program_name, program_code, degree_level)
          `)
          .eq('id', id)
          .single();

        if (error || !student) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const admissionData: AdmissionLetterData = {
          studentName: `${student.users?.first_name || ''} ${student.users?.last_name || ''}`,
          studentId: student.student_id,
          program: student.programs?.program_name || 'N/A',
          programCode: student.programs?.program_code || 'N/A',
          degreeLevel: student.programs?.degree_level || 'undergraduate',
          admissionDate: new Date(student.admission_date || new Date()).toLocaleDateString(),
          academicYear: student.academic_year || '2025',
          semester: student.current_semester || 'Semester 1',
          campus: 'Main Campus',
        };

        pdfDoc = PDFGenerator.generateAdmissionLetter(admissionData);
        filename = `Admission_Letter_${student.student_id}.pdf`;
        break;
      }

      case 'student_id': {
        // Fetch student data
        const { data: student, error } = await supabase
          .from('students')
          .select(`
            *,
            users!students_student_id (first_name, last_name),
            programs (program_name, program_code)
          `)
          .eq('id', id)
          .single();

        if (error || !student) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const idData: StudentIDData = {
          studentId: student.student_id,
          studentName: `${student.users?.first_name || ''} ${student.users?.last_name || ''}`,
          program: student.programs?.program_name || 'N/A',
          programCode: student.programs?.program_code || 'N/A',
          year: student.current_year_level || 1,
          issueDate: new Date().toLocaleDateString(),
          expiryDate: new Date(new Date().getFullYear() + 4, 11, 31).toLocaleDateString(),
        };

        pdfDoc = PDFGenerator.generateStudentID(idData);
        filename = `Student_ID_${student.student_id}.pdf`;
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid PDF type' }, { status: 400 });
    }

    // Generate PDF blob
    const pdfBlob = pdfDoc.output('blob');
    const buffer = await pdfBlob.arrayBuffer();

    // Return PDF as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 });
  }
}
