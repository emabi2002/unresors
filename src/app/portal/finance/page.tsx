'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          students!student_id (student_id),
          users!students_student_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    filter === 'all' || inv.status === filter
  );

  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
    collected: invoices.reduce((sum, inv) => sum + parseFloat(inv.amount_paid || 0), 0),
    outstanding: invoices.reduce((sum, inv) => sum + parseFloat(inv.balance || 0), 0),
    invoiceCount: invoices.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600">Manage student fees, invoices, and payments</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">K {stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collected</p>
                  <p className="text-2xl font-bold text-green-600">K {stats.collected.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">K {stats.outstanding.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Invoices</p>
                  <p className="text-2xl font-bold">{stats.invoiceCount}</p>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Invoices</CardTitle>
                <CardDescription>Track and manage student payments</CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.students?.student_id || 'N/A'}</TableCell>
                    <TableCell>
                      {invoice.users?.first_name} {invoice.users?.last_name}
                    </TableCell>
                    <TableCell>K {parseFloat(invoice.total_amount).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-green-600">K {parseFloat(invoice.amount_paid).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-red-600">K {parseFloat(invoice.balance).toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' :
                        invoice.status === 'partially_paid' ? 'secondary' :
                        'destructive'
                      }>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredInvoices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No invoices found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
