'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function RegistrarPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          users!student_id (email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('student_enrollments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Enrollment ${status}`);
      fetchEnrollments();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredEnrollments = enrollments.filter(e =>
    filter === 'all' || e.status === filter
  );

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'pending_approval').length,
    approved: enrollments.filter(e => e.status === 'approved').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
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
          <h1 className="text-3xl font-bold text-gray-900">Registrar Dashboard</h1>
          <p className="text-gray-600">Manage student enrollments and course registrations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Enrollments</CardTitle>
                <CardDescription>Review and approve enrollment registrations</CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Enrollments</SelectItem>
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      {enrollment.users?.first_name} {enrollment.users?.last_name}
                    </TableCell>
                    <TableCell>{enrollment.users?.email}</TableCell>
                    <TableCell>{enrollment.program_code}</TableCell>
                    <TableCell>{enrollment.level}</TableCell>
                    <TableCell>{enrollment.academic_year}</TableCell>
                    <TableCell>{new Date(enrollment.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        enrollment.status === 'approved' ? 'default' :
                        enrollment.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.status === 'pending_approval' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => updateStatus(enrollment.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => updateStatus(enrollment.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredEnrollments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No enrollments found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
