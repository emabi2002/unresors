'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  FileText,
  BookOpen,
  CreditCard,
  User,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

// Mock data - will be replaced with Supabase data
const mockStudent = {
  id: 'STU-2025-001',
  name: 'John Doe',
  email: 'john.doe@student.unre.edu.pg',
  program: 'Bachelor of Environmental Science',
  year: 1,
  semester: 'Semester 1',
  academicStanding: 'good' as const,
  gpa: 3.45,
  creditsEarned: 0,
  profilePhoto: null,
};

const mockApplication = {
  id: 'APP-001',
  status: 'approved' as const,
  submittedDate: '2025-01-15',
  approvedDate: '2025-01-20',
  program: 'Bachelor of Environmental Science',
  approvalChain: [
    { role: 'Registrar', approved: true, date: '2025-01-16' },
    { role: 'Department Head', approved: true, date: '2025-01-18' },
    { role: 'Dean', approved: true, date: '2025-01-20' },
  ],
};

const mockCourses = [
  { id: '1', code: 'ENV101', name: 'Introduction to Environmental Science', credits: 3, status: 'enrolled' as const },
  { id: '2', code: 'BIO101', name: 'General Biology', credits: 4, status: 'enrolled' as const },
  { id: '3', code: 'CHE101', name: 'General Chemistry', credits: 4, status: 'pending_advisor' as const },
  { id: '4', code: 'MAT101', name: 'Mathematics I', credits: 3, status: 'enrolled' as const },
];

const mockInvoice = {
  invoiceNumber: 'INV-2025-001',
  totalAmount: 4500,
  amountPaid: 2000,
  balance: 2500,
  dueDate: '2025-02-28',
  status: 'partial' as const,
  breakdown: {
    tuition: 3000,
    lodging: 800,
    messing: 500,
    ictLevy: 100,
    studentServices: 100,
  },
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real student data from database
  useEffect(() => {
    async function fetchStudentData() {
      if (!user || !user.student) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        // Fetch student details with related data
        const { data: studentInfo, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;

        // Fetch student's application
        const { data: application, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Fetch enrollments
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses (
              course_code,
              course_name,
              credits
            )
          `)
          .eq('student_id', user.id)
          .eq('semester', 'semester_1')
          .eq('academic_year', 2025);

        // Fetch invoice
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setStudentData({
          student: studentInfo,
          application: application || null,
          enrollments: enrollments || [],
          invoice: invoice || null,
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudentData();
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || !user.student) {
    router.push('/login');
    return null;
  }

  // Use real data if available, otherwise fall back to mock data
  const displayStudent = studentData?.student || mockStudent;
  const displayApplication = studentData?.application || mockApplication;
  const displayCourses = studentData?.enrollments?.map((e: any) => ({
    id: e.id,
    code: e.courses?.course_code || 'N/A',
    name: e.courses?.course_name || 'N/A',
    credits: e.courses?.credits || 0,
    status: e.status || 'enrolled',
  })) || mockCourses;
  const displayInvoice = studentData?.invoice || mockInvoice;

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: { variant: 'default' as const, className: 'bg-green-600', icon: CheckCircle },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-600', icon: Clock },
      rejected: { variant: 'destructive' as const, className: 'bg-red-600', icon: XCircle },
      enrolled: { variant: 'default' as const, className: 'bg-blue-600', icon: CheckCircle },
      pending_advisor: { variant: 'secondary' as const, className: 'bg-orange-600', icon: AlertCircle },
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full">
                <GraduationCap className="h-8 w-8 text-emerald-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                <p className="text-emerald-200">{user.student?.student_id || 'N/A'} • {displayStudent.program || user.email}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">
              <GraduationCap className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="application">
              <FileText className="mr-2 h-4 w-4" />
              Application
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Standing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-emerald-600">{displayStudent.gpa}</p>
                      <p className="text-sm text-gray-600">Current GPA</p>
                    </div>
                    {getStatusBadge(displayStudent.academicStanding)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credits Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-600">{displayStudent.creditsEarned}</p>
                  <p className="text-sm text-gray-600">Total Credits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-orange-600">K {displayInvoice.balance.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Balance Due</p>
                    </div>
                    {getStatusBadge(displayInvoice.status)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Link href="/portal/student/enroll">
                    <Button className="h-auto flex-col py-4 bg-emerald-600 hover:bg-emerald-700 w-full">
                      <FileText className="h-8 w-8 mb-2" />
                      <span>Complete Registration</span>
                    </Button>
                  </Link>
                  <Link href="/portal/student/register-courses">
                    <Button className="h-auto flex-col py-4 bg-blue-600 hover:bg-blue-700 w-full">
                      <BookOpen className="h-8 w-8 mb-2" />
                      <span>Select Courses</span>
                    </Button>
                  </Link>
                  <Button className="h-auto flex-col py-4 bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="h-8 w-8 mb-2" />
                    <span>Make Payment</span>
                  </Button>
                  <Button className="h-auto flex-col py-4 bg-purple-600 hover:bg-purple-700">
                    <Download className="h-8 w-8 mb-2" />
                    <span>Download Invoice</span>
                  </Button>
                  <Button className="h-auto flex-col py-4 bg-teal-600 hover:bg-teal-700">
                    <FileText className="h-8 w-8 mb-2" />
                    <span>View Timetable</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Current Semester Courses</CardTitle>
                <CardDescription>{displayStudent.semester} - {displayCourses.length} courses enrolled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayCourses.map((course: any) => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-emerald-900">{course.code}</p>
                        <p className="text-sm text-gray-600">{course.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{course.credits} Credits</span>
                        {getStatusBadge(course.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Tab */}
          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Track your admission application progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-semibold text-lg">{displayApplication.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-semibold">{displayApplication.submittedDate}</p>
                  </div>
                  <div>
                    {getStatusBadge(displayApplication.status)}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Approval Timeline</h3>
                  <div className="space-y-4">
                    {displayApplication.approvalChain.map((approval: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`mt-1 rounded-full p-1 ${approval.approved ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {approval.approved ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{approval.role}</p>
                          {approval.approved && (
                            <p className="text-sm text-gray-600">Approved on {approval.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Application Approved!</p>
                      <p className="text-sm text-green-800 mt-1">
                        Your application has been approved. You can now proceed with course registration and payment.
                      </p>
                      <Button className="mt-3 bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download Offer Letter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>Your application documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {['Grade 12 Certificate', 'Academic Transcript', 'National ID', 'Passport Photo'].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">{doc}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Registration</CardTitle>
                <CardDescription>Register for courses for {displayStudent.semester}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayCourses.map((course: any) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-emerald-900">{course.code}</span>
                          <Badge variant="outline">{course.credits} Credits</Badge>
                          {getStatusBadge(course.status)}
                        </div>
                        <p className="text-gray-700">{course.name}</p>
                      </div>
                      {course.status === 'pending_advisor' && (
                        <Button variant="outline" size="sm">
                          Request Approval
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Total Credits: 14</p>
                      <p className="text-sm text-blue-800 mt-1">
                        You are registered for 14 credits this semester. The recommended load is 12-18 credits.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Invoice</CardTitle>
                <CardDescription>Invoice #{displayInvoice.invoiceNumber} - Due {displayInvoice.dueDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-emerald-900">K {displayInvoice.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="text-2xl font-bold text-blue-900">K {displayInvoice.amountPaid.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-2xl font-bold text-orange-900">K {displayInvoice.balance.toFixed(2)}</p>
                  </div>
                </div>

                {displayInvoice.breakdown && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Fee Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(displayInvoice.breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium">K {(value as number).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>K {displayInvoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your previous payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Payment #PAY-001</p>
                      <p className="text-sm text-gray-600">2025-01-25 • BSP Pay</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">K 2,000.00</p>
                      <Badge className="bg-green-600">Successful</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your student profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-semibold">{displayStudent.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{displayStudent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-semibold">{displayStudent.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year Level</p>
                    <p className="font-semibold">Year {displayStudent.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Semester</p>
                    <p className="font-semibold">{displayStudent.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Academic Standing</p>
                    <p className="font-semibold capitalize">{displayStudent.academicStanding}</p>
                  </div>
                </div>

                <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
