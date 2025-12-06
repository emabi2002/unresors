'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Trash2,
  Calculator,
  FileText,
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  credits: number;
  prerequisites: string[];
  capacity: number;
  enrolled_count: number;
  schedule?: string;
  lecturer?: string;
  department: string;
}

interface SelectedCourse extends Course {
  status: 'selected' | 'pending_advisor' | 'enrolled';
}

const TUITION_PER_CREDIT = 150; // K150 per credit
const ADDITIONAL_FEES = {
  ict_levy: 100,
  student_services: 100,
  library: 50,
};

export default function CourseRegistrationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  // 🧪 TESTING MODE
  const TESTING_MODE = true;
  const TEST_ADMIN_ID = 'a0000000-0000-0000-0000-000000000001';

  // Calculate totals
  const totalCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  const MIN_CREDITS = studentData?.programs?.degree_level === 'postgraduate' ? 9 : 12;
  const MAX_CREDITS = studentData?.programs?.degree_level === 'postgraduate' ? 12 : 18;
  const tuitionCost = totalCredits * TUITION_PER_CREDIT;
  const additionalFeesCost = Object.values(ADDITIONAL_FEES).reduce((sum, fee) => sum + fee, 0);
  const grandTotal = tuitionCost + additionalFeesCost;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const supabase = createClient();
      const userId = TESTING_MODE ? TEST_ADMIN_ID : user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch student's program info
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          programs (
            id,
            program_code,
            program_name,
            degree_level,
            min_credits_per_semester,
            max_credits_per_semester
          )
        `)
        .eq('id', userId)
        .single();

      if (studentError) throw studentError;
      setStudentData(student);

      // Get current semester
      const { data: semester } = await supabase
        .from('semesters')
        .select('id, semester')
        .eq('is_current', true)
        .single();

      // Fetch available courses for Year 1 (or student's current year)
      // For now, get all semester_1 courses for the student's program
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          course_code,
          course_name,
          credits,
          description,
          course_type,
          semester_offered,
          max_capacity,
          prerequisites,
          departments (
            department_code,
            department_name
          )
        `)
        .eq('is_active', true)
        .eq('semester_offered', 'semester_1')
        .order('course_code');

      if (error) throw error;

      // Transform courses for display
      const transformedCourses = courses?.map((c: any) => ({
        id: c.id,
        course_code: c.course_code,
        course_name: c.course_name,
        credits: c.credits,
        prerequisites: [],
        capacity: 50,
        enrolled_count: 0,
        department: c.departments?.department_name || 'General',
        description: c.description,
      })) || [];

      setAvailableCourses(transformedCourses);

      // Get unique departments
      const depts = [...new Set(transformedCourses.map(c => c.department))];
      setDepartments(depts);

      // Fetch currently registered courses
      const coursesWithCounts = await Promise.all(
        (courses || []).map(async (course) => {
          const { count } = await supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('academic_year', 2025)
            .eq('semester', 'semester_1');

          return {
            ...course,
            enrolled_count: count || 0,
            capacity: course.max_capacity || 50,
            prerequisites: course.prerequisites || [],
            department: (course.departments as any)?.[0]?.department_name || 'General',
          };
        })
      );

      setAvailableCourses(coursesWithCounts);

      // Extract unique departments
      const uniqueDepts = [...new Set(coursesWithCounts.map(c => c.department))];
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load available courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentEnrollments = async () => {
    if (!user) return;

    try {
      const supabase = createClient();

      // Fetch student's current enrollments
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          status,
          courses (
            id,
            course_code,
            course_name,
            credits,
            department,
            prerequisites,
            max_capacity
          )
        `)
        .eq('student_id', user.id)
        .eq('academic_year', 2025)
        .eq('semester', 'semester_1');

      if (error) throw error;

      if (enrollments && enrollments.length > 0) {
        const enrolled = enrollments.map(e => ({
          ...(e.courses as any),
          status: e.status as any,
          enrolled_count: 0,
          capacity: (e.courses as any).max_capacity || 50,
          prerequisites: (e.courses as any).prerequisites || [],
        }));
        setSelectedCourses(enrolled);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleAddCourse = (course: Course) => {
    // Check if course is already selected
    if (selectedCourses.find(c => c.id === course.id)) {
      toast.error('Course already selected');
      return;
    }

    // Check if course is full
    if (course.enrolled_count >= course.capacity) {
      toast.error('Course is full');
      return;
    }

    // Check prerequisites (simplified - you can make this more sophisticated)
    if (course.prerequisites && course.prerequisites.length > 0) {
      toast.info(`This course requires prerequisites: ${course.prerequisites.join(', ')}`);
    }

    // Check credit limit (12-18 for undergrad, 9-12 for postgrad)
    if (totalCredits + course.credits > MAX_CREDITS) {
      toast.error(`Cannot exceed ${MAX_CREDITS} credits per semester`);
      return;
    }

    // Add course to selected list
    setSelectedCourses([...selectedCourses, { ...course, status: 'selected' }]);
    toast.success(`Added ${course.course_code} to your registration`);
  };

  const handleRemoveCourse = (courseId: string) => {
    const course = selectedCourses.find(c => c.id === courseId);
    if (course && course.status === 'enrolled') {
      toast.error('Cannot remove already enrolled courses. Contact registrar to drop.');
      return;
    }

    setSelectedCourses(selectedCourses.filter(c => c.id !== courseId));
    toast.success('Course removed from registration');
  };

  const handleSubmitRegistration = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Please select at least one course');
      return;
    }

    if (totalCredits < MIN_CREDITS) {
      toast.warning(`Minimum ${MIN_CREDITS} credits required. Add more courses or request special permission.`);
      return;
    }

    if (totalCredits > MAX_CREDITS) {
      toast.error(`Maximum ${MAX_CREDITS} credits allowed. Remove some courses.`);
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // Create enrollments for selected courses
      const newEnrollments = selectedCourses
        .filter(c => c.status === 'selected')
        .map(course => ({
          student_id: user!.id,
          course_id: course.id,
          academic_year: 2025,
          semester: 'semester_1',
          status: 'pending_advisor',
          enrolled_by: user!.id,
        }));

      if (newEnrollments.length > 0) {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert(newEnrollments);

        if (enrollError) throw enrollError;
      }

      // Create invoice for the fees
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          student_id: user!.id,
          invoice_number: `INV-2025-${Date.now()}`,
          academic_year: 2025,
          semester: 'semester_1',
          total_amount: grandTotal,
          amount_paid: 0,
          balance: grandTotal,
          due_date: '2025-02-28',
          status: 'pending',
          generated_by: user!.id,
        });

      if (invoiceError) throw invoiceError;

      toast.success('Course registration submitted successfully!');
      toast.info('Awaiting advisor approval. Invoice generated.');

      // Redirect back to student portal
      setTimeout(() => {
        router.push('/portal/student');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter courses based on search and department
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'all' || course.department === filterDepartment;
    const notSelected = !selectedCourses.find(c => c.id === course.id);
    return matchesSearch && matchesDept && notSelected;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/portal/student">
            <Button variant="ghost" className="text-white hover:text-emerald-100 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full">
                <BookOpen className="h-8 w-8 text-emerald-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Course Registration</h1>
                <p className="text-emerald-200">Semester 1, 2025 • Select your courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Testing Mode Banner */}
        {TESTING_MODE && (
          <div className="mb-6 bg-blue-100 border-2 border-blue-400 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="text-blue-600 text-3xl">🧪</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2">TESTING MODE - Course Registration</h3>
                <div className="text-blue-800 space-y-2">
                  <p className="font-semibold">Testing with real database courses:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Student:</strong> TEST-ADMIN-001</li>
                    <li><strong>Program:</strong> {studentData?.programs?.program_name || 'Loading...'}</li>
                    <li><strong>Credit Limits:</strong> {MIN_CREDITS}-{MAX_CREDITS} credits per semester</li>
                    <li><strong>Available Courses:</strong> {availableCourses.length} courses loaded from database</li>
                    <li>✅ Real courses from database</li>
                    <li>✅ Credit limit enforcement active</li>
                    <li>⚠️ Authentication bypassed for testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Available Courses */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Browse and select courses for this semester</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Course List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No courses found</p>
                    </div>
                  ) : (
                    filteredCourses.map(course => (
                      <div
                        key={course.id}
                        className="border rounded-lg p-4 hover:bg-emerald-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-emerald-900">{course.course_code}</span>
                              <Badge variant="outline">{course.credits} Credits</Badge>
                              {course.enrolled_count >= course.capacity * 0.9 && (
                                <Badge className="bg-orange-600">Almost Full</Badge>
                              )}
                              {course.enrolled_count >= course.capacity && (
                                <Badge className="bg-red-600">Full</Badge>
                              )}
                            </div>
                            <p className="font-medium text-gray-900 mb-1">{course.course_name}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>{course.department}</span>
                              <span>•</span>
                              <span>{course.enrolled_count}/{course.capacity} enrolled</span>
                              {course.schedule && (
                                <>
                                  <span>•</span>
                                  <span>{course.schedule}</span>
                                </>
                              )}
                            </div>
                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>Prerequisites: {course.prerequisites.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleAddCourse(course)}
                            disabled={course.enrolled_count >= course.capacity}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Selected Courses & Summary */}
          <div className="space-y-6">
            {/* Selected Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Selected Courses ({selectedCourses.length})
                </CardTitle>
                <CardDescription>
                  {totalCredits} credits • K{grandTotal.toFixed(2)} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCourses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No courses selected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCourses.map(course => (
                      <div key={course.id} className="border rounded-lg p-3 bg-emerald-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{course.course_code}</span>
                              {course.status === 'enrolled' && (
                                <Badge className="bg-green-600 text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Enrolled
                                </Badge>
                              )}
                              {course.status === 'pending_advisor' && (
                                <Badge className="bg-yellow-600 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-700">{course.course_name}</p>
                          </div>
                          {course.status === 'selected' && (
                            <Button
                              onClick={() => handleRemoveCourse(course.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{course.credits} credits</span>
                          <span>K{(course.credits * TUITION_PER_CREDIT).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Credit Warning */}
                {totalCredits > 0 && (
                  <div className="mt-4">
                    {totalCredits < MIN_CREDITS && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-800">
                          Minimum {MIN_CREDITS} credits required. Add more courses.
                        </p>
                      </div>
                    )}
                    {totalCredits > MAX_CREDITS && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">
                          Maximum {MAX_CREDITS} credits exceeded. Remove some courses.
                        </p>
                      </div>
                    )}
                    {totalCredits >= MIN_CREDITS && totalCredits <= MAX_CREDITS && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-800">
                          Good! You have {totalCredits} credits selected ({MIN_CREDITS}-{MAX_CREDITS} required).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fee Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Fee Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tuition ({totalCredits} credits × K{TUITION_PER_CREDIT})</span>
                    <span className="font-medium">K{tuitionCost.toFixed(2)}</span>
                  </div>
                  {Object.entries(ADDITIONAL_FEES).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">K{value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">K{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitRegistration}
                  disabled={submitting || selectedCourses.length === 0 || totalCredits < MIN_CREDITS || totalCredits > MAX_CREDITS}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Submit Registration
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  An invoice will be generated after submission
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
