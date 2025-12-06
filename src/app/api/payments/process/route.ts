import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';
import { PDFGenerator, type ReceiptData } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      invoiceId,
      amount,
      paymentMethod,
      transactionReference,
      description,
      processedBy,
    } = await request.json();

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: 'Invoice ID and amount are required' },
        { status: 400 }
      );
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        students!student_id (student_id),
        users!students_student_id (id, email, first_name, last_name),
        programs!students_program_id (program_name)
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const paymentAmount = parseFloat(amount);
    const currentBalance = parseFloat(invoice.balance);
    const currentPaid = parseFloat(invoice.amount_paid);

    // Calculate new amounts
    const newAmountPaid = currentPaid + paymentAmount;
    const newBalance = currentBalance - paymentAmount;

    // Determine new invoice status
    let newStatus = 'pending';
    if (newBalance <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partially_paid';
    }

    // Generate receipt number
    const receiptNumber = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        student_id: invoice.student_id,
        invoice_id: invoiceId,
        receipt_number: receiptNumber,
        amount: paymentAmount,
        payment_method: paymentMethod || 'bank_deposit',
        transaction_reference: transactionReference,
        payment_date: new Date().toISOString(),
        description: description || `Payment for ${invoice.invoice_number}`,
        status: 'completed',
        processed_by: processedBy,
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json(
        { error: 'Failed to record payment' },
        { status: 500 }
      );
    }

    // Update invoice
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        amount_paid: newAmountPaid,
        balance: newBalance,
        status: newStatus,
        last_payment_date: new Date().toISOString(),
      })
      .eq('id', invoiceId);

    if (updateError) {
      console.error('Invoice update error:', updateError);
      // Rollback payment
      await supabase.from('payments').delete().eq('id', payment.id);
      return NextResponse.json(
        { error: 'Failed to update invoice' },
        { status: 500 }
      );
    }

    // Generate receipt PDF
    const receiptData: ReceiptData = {
      receiptNumber: receiptNumber,
      studentId: invoice.students?.student_id || 'N/A',
      studentName: `${invoice.users?.first_name || ''} ${invoice.users?.last_name || ''}`,
      program: invoice.programs?.program_name || 'N/A',
      paymentDate: new Date().toLocaleDateString(),
      paymentMethod: paymentMethod || 'Bank Deposit',
      amount: paymentAmount,
      description: description || `Payment for ${invoice.invoice_number}`,
      balance: newBalance,
    };

    const receiptPDF = PDFGenerator.generateReceipt(receiptData);
    const pdfBuffer = Buffer.from(receiptPDF.output('arraybuffer'));

    // Upload receipt to storage
    const receiptFileName = `receipts/${receiptNumber}.pdf`;
    await supabase.storage
      .from('documents')
      .upload(receiptFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    // Send payment confirmation email
    if (invoice.users?.email) {
      await emailService.sendPaymentConfirmation(
        invoice.users.email,
        `${invoice.users.first_name} ${invoice.users.last_name}`,
        paymentAmount,
        receiptNumber,
        description || `Payment for ${invoice.invoice_number}`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        receiptNumber: receiptNumber,
        amount: paymentAmount,
        newBalance: newBalance,
        invoiceStatus: newStatus,
      },
    });
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
