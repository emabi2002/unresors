'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          programs (program_code, program_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id: string, applicantName: string) => {
    if (!confirm(`Approve application for ${applicantName}?\n\nThis will:\n- Create a student account\n- Generate Student ID\n- Send admission letter via email\n- Create enrollment invoice`)) {
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: id, approvedBy: user?.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve application');
      }

      toast.success(`✅ Application approved! Student ID: ${result.studentId}`);
      toast.info(`📧 Admission letter sent to ${result.email}`);
      fetchApplications();
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const rejectApplication = async (id: string, applicantName: string) => {
    const reason = prompt(`Reject application for ${applicantName}?\n\nPlease provide a reason:`);

    if (!reason) {
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: id, reason, rejectedBy: user?.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject application');
      }

      toast.success(`Application rejected`);
      toast.info(`📧 Notification sent to applicant`);
      fetchApplications();
    } catch (error: any) {
      console.error('Rejection error:', error);
      toast.error(error.message || 'Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const filteredApps = applications.filter(app =>
    filter === 'all' || app.status === filter
  );

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admissions Dashboard</h1>
          <p className="text-gray-600">Review and manage student applications</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.submitted}</p>
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

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Review and process student applications</CardDescription>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="submitted">Pending</SelectItem>
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
                  <TableHead>Application ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-sm">{app.application_id}</TableCell>
                    <TableCell>{app.first_name} {app.last_name}</TableCell>
                    <TableCell>{app.applicant_email}</TableCell>
                    <TableCell>{app.programs?.program_code || 'N/A'}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        app.status === 'approved' ? 'default' :
                        app.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {app.status === 'submitted' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => approveApplication(app.id, `${app.first_name} ${app.last_name}`)}
                            disabled={processing}
                          >
                            {processing ? 'Processing...' : '✓ Approve & Create'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => rejectApplication(app.id, `${app.first_name} ${app.last_name}`)}
                            disabled={processing}
                          >
                            ✗ Reject
                          </Button>
                        </div>
                      )}
                      {app.status === 'approved' && (
                        <span className="text-sm text-green-600 font-medium">✓ Student created</span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="text-sm text-red-600">✗ Rejected</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredApps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No applications found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
