'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  FileText,
  User,
  GraduationCap,
  DollarSign,
  CheckCircle2,
  Loader2,
  Save,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

const PROVINCES = [
  'National Capital District',
  'Central',
  'Gulf',
  'Milne Bay',
  'Oro (Northern)',
  'Southern Highlands',
  'Western Highlands',
  'Enga',
  'Western',
  'East Sepik',
  'West Sepik (Sandaun)',
  'Madang',
  'Morobe',
  'Eastern Highlands',
  'Chimbu (Simbu)',
  'East New Britain',
  'West New Britain',
  'New Ireland',
  'Manus',
  'Bougainville',
];

const RELIGIONS = ['Christian', 'Catholic', 'Anglican', 'Lutheran', 'SDA', 'Pentecostal', 'Other'];
const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function EnrollmentRegistrationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🧪 TESTING MODE: Set to true to bypass authentication
  const TESTING_MODE = true; // Change to false when authentication is enabled

  // Test admin account UUID
  const TEST_ADMIN_ID = 'a0000000-0000-0000-0000-000000000001';

  // Fee breakdown state
  const [feeBreakdown, setFeeBreakdown] = useState({
    tuition: 0,
    compulsory: 0,
    boarding: 0,
    total: 0,
  });

  // Student data state
  const [studentData, setStudentData] = useState<any>(null);

  // Section 1: PERSONAL
  const [personalData, setPersonalData] = useState({
    surname: '',
    firstName: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    maritalStatus: '',
    idNumber: '',
    slfNumber: '',
    religion: '',
    homeProvince: '',
    residingDistrict: '',
    homeAddress: '',
    residingProvince: '',
    privateEmail: '',
    nextOfKin: '',
    relationToNextOfKin: '',
    nextOfKinContact: '',
    nearestAirport: '',
    nationality: 'Papua New Guinean',
    secondarySchool: '',
    matriculationCentre: '',
  });

  // Section 2: ACADEMIC
  const [academicData, setAcademicData] = useState({
    programCode: '',
    level: '',
    strand: '',
    firstSemesterCourses: ['', '', '', '', '', ''],
    secondSemesterCourses: ['', '', '', '', '', ''],
  });

  // Section 3: FINANCIAL
  const [financialData, setFinancialData] = useState({
    residentType: 'resident',
    sponsor: '',
    dormitory: '',
    amountPaid: '',
    roomNumber: '',
    receiptNumber: '',
    libraryNumber: '',
    mealNumber: '',
    compulsoryFeesPaid: false,
    boardingFeesPaid: false,
  });

  // Section 4: DECLARATION
  const [declarationData, setDeclarationData] = useState({
    agreed: false,
    signature: '',
    date: new Date().toISOString().split('T')[0],
    witness: '',
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const supabase = createClient();

      // Use test admin ID in testing mode, otherwise use authenticated user
      const userId = TESTING_MODE ? TEST_ADMIN_ID : user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch student data with program and fee information
      const { data: studentInfo, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          programs (
            id,
            program_code,
            program_name,
            degree_level
          )
        `)
        .eq('id', userId)
        .single();

      if (studentError) {
        console.error('Error fetching student:', studentError);
        setLoading(false);
        return;
      }

      setStudentData(studentInfo);

      // Fetch current semester
      const { data: semester } = await supabase
        .from('semesters')
        .select('id')
        .eq('is_current', true)
        .single();

      // Fetch fee structure for student's program
      if (studentInfo?.program_id && semester?.id) {
        const { data: fees } = await supabase
          .from('fee_structures')
          .select('*')
          .eq('program_id', studentInfo.program_id)
          .eq('semester_id', semester.id)
          .single();

        if (fees) {
          const tuition = fees.tuition_fee || 0;
          const compulsory =
            (fees.clinical_services_fee || 0) +
            (fees.student_association_fee || 0) +
            (fees.academic_resources_fee || 0) +
            (fees.ict_levy || 0) +
            (fees.insurance_fee || 0) +
            (fees.repairs_maintenance_fee || 0);
          const boarding = studentInfo.residential_status === 'residential'
            ? (fees.lodging_fee || 0)
            : 0;

          setFeeBreakdown({
            tuition,
            compulsory,
            boarding,
            total: tuition + compulsory + boarding,
          });
        }
      }

      // Pre-populate form data
      setPersonalData({
        surname: studentInfo.student_id?.split('-')[0] || 'Test',
        firstName: 'Admin',
        gender: 'male',
        dateOfBirth: '2000-01-01',
        age: '25',
        maritalStatus: studentInfo.marital_status || 'single',
        idNumber: '12345678',
        slfNumber: studentInfo.slf_number || '',
        religion: studentInfo.religion || 'christian',
        homeProvince: 'East New Britain',
        residingDistrict: 'Kokopo',
        homeAddress: 'Test Address',
        residingProvince: 'East New Britain',
        privateEmail: 'admin.test@unre.ac.pg',
        nextOfKin: studentInfo.next_of_kin || 'Test Parent',
        relationToNextOfKin: studentInfo.next_of_kin_relationship || 'parent',
        nextOfKinContact: studentInfo.next_of_kin_contact || '+675 7000 0001',
        nearestAirport: 'Tokua Airport',
        nationality: 'Papua New Guinean',
        secondarySchool: studentInfo.secondary_school || 'Test High School',
        matriculationCentre: '',
      });

      setAcademicData({
        programCode: studentInfo.programs?.program_code || '',
        level: `Year ${studentInfo.current_year || 1}`,
        strand: '',
        firstSemesterCourses: ['', '', '', '', '', ''],
        secondSemesterCourses: ['', '', '', '', '', ''],
      });

      setFinancialData(prev => ({
        ...prev,
        residentType: studentInfo.residential_status === 'residential' ? 'resident' : 'non-resident',
      }));

    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student information');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));

    // Auto-calculate age when DOB changes
    if (field === 'dateOfBirth' && value) {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      setPersonalData(prev => ({ ...prev, age: String(age) }));
    }
  };

  const handleCourseChange = (semester: 'first' | 'second', index: number, value: string) => {
    if (semester === 'first') {
      const updated = [...academicData.firstSemesterCourses];
      updated[index] = value;
      setAcademicData(prev => ({ ...prev, firstSemesterCourses: updated }));
    } else {
      const updated = [...academicData.secondSemesterCourses];
      updated[index] = value;
      setAcademicData(prev => ({ ...prev, secondSemesterCourses: updated }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!declarationData.agreed) {
      toast.error('You must agree to the declaration before submitting');
      return;
    }

    setSubmitting(true);

    try {
      // 🧪 TESTING MODE - Skip database operations
      if (TESTING_MODE) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('📝 TESTING MODE - Form Data (not saved to database):');
        console.log('Personal:', personalData);
        console.log('Academic:', academicData);
        console.log('Financial:', financialData);
        console.log('Declaration:', declarationData);

        toast.success('✅ Form validated successfully! (Testing Mode)');
        toast.info('🧪 Data shown in browser console. Database operations skipped.');
        toast.info('Enable authentication to save data to database');

        setSubmitting(false);
        return;
      }

      // PRODUCTION MODE - Save to database
      const supabase = createClient();

      // Update student record with all personal information
      const { error: studentError } = await supabase
        .from('students')
        .update({
          // Personal info
          marital_status: personalData.maritalStatus,
          id_number: personalData.idNumber,
          slf_number: personalData.slfNumber,
          religion: personalData.religion,
          home_province: personalData.homeProvince,
          residing_district: personalData.residingDistrict,
          home_address: personalData.homeAddress,
          residing_province: personalData.residingProvince,
          next_of_kin: personalData.nextOfKin,
          next_of_kin_relationship: personalData.relationToNextOfKin,
          next_of_kin_contact: personalData.nextOfKinContact,
          nearest_airport: personalData.nearestAirport,
          secondary_school: personalData.secondarySchool,
          matriculation_centre: personalData.matriculationCentre,

          // Financial info
          resident_type: financialData.residentType,
          sponsor: financialData.sponsor,
          dormitory: financialData.dormitory,
          room_number: financialData.roomNumber,

          // Update timestamp
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (studentError) throw studentError;

      // Create enrollment record
      const { error: enrollmentError } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: user!.id,
          academic_year: 2025,
          semester: 'semester_1',
          program_code: academicData.programCode,
          level: academicData.level,
          strand: academicData.strand,

          // Courses
          first_semester_courses: academicData.firstSemesterCourses.filter(c => c !== ''),
          second_semester_courses: academicData.secondSemesterCourses.filter(c => c !== ''),

          // Financial
          amount_paid: parseFloat(financialData.amountPaid) || 0,
          receipt_number: financialData.receiptNumber,
          library_number: financialData.libraryNumber,
          meal_number: financialData.mealNumber,
          compulsory_fees_paid: financialData.compulsoryFeesPaid,
          boarding_fees_paid: financialData.boardingFeesPaid,

          // Declaration
          declaration_agreed: declarationData.agreed,
          signature: declarationData.signature,
          witness: declarationData.witness,
          registration_date: declarationData.date,

          status: 'pending_approval',
          created_at: new Date().toISOString(),
        });

      if (enrollmentError) throw enrollmentError;

      toast.success('Registration submitted successfully!');
      toast.info('Your registration is pending approval by the registrar');

      // Redirect to dashboard after 2 seconds
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

  // Skip loading screen in testing mode
  if (!TESTING_MODE && (authLoading || loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading registration form...</p>
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
            <div>
              <h1 className="text-3xl font-bold">REGISTRATION OF ENROLLMENT</h1>
              <p className="text-emerald-200">Registration Details for 2025 Academic Year</p>
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
                <h3 className="text-xl font-bold text-blue-900 mb-2">TESTING MODE - Using Test Admin Account</h3>
                <div className="text-blue-800 space-y-2">
                  <p className="font-semibold">Testing with real database data:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Student ID:</strong> TEST-ADMIN-001</li>
                    <li><strong>Program:</strong> {studentData?.programs?.program_name || 'Loading...'}</li>
                    <li><strong>Fees:</strong> K {feeBreakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} (from database)</li>
                    <li>✅ Form data is pre-populated from database</li>
                    <li>✅ Fee structure fetched in real-time</li>
                    <li>⚠️ Authentication bypassed for testing</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Next:</strong> Enable Azure AD SSO before production deployment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: PERSONAL */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Section 1: PERSONAL
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    value={personalData.surname}
                    onChange={(e) => handlePersonalChange('surname', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">Name *</Label>
                  <Input
                    id="firstName"
                    value={personalData.firstName}
                    onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={personalData.gender} onValueChange={(v) => handlePersonalChange('gender', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map(g => <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dob">DoB *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={personalData.dateOfBirth}
                    onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={personalData.age}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status *</Label>
                  <Select value={personalData.maritalStatus} onValueChange={(v) => handlePersonalChange('maritalStatus', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUS.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="idNumber">ID No *</Label>
                  <Input
                    id="idNumber"
                    value={personalData.idNumber}
                    onChange={(e) => handlePersonalChange('idNumber', e.target.value)}
                    placeholder="National ID Number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slfNumber">SLF No</Label>
                  <Input
                    id="slfNumber"
                    value={personalData.slfNumber}
                    onChange={(e) => handlePersonalChange('slfNumber', e.target.value)}
                    placeholder="Student Loan Fund Number"
                  />
                </div>
                <div>
                  <Label htmlFor="religion">Religion *</Label>
                  <Select value={personalData.religion} onValueChange={(v) => handlePersonalChange('religion', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELIGIONS.map(r => <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="homeProvince">Home Province *</Label>
                  <Select value={personalData.homeProvince} onValueChange={(v) => handlePersonalChange('homeProvince', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="residingDistrict">Residing District *</Label>
                  <Input
                    id="residingDistrict"
                    value={personalData.residingDistrict}
                    onChange={(e) => handlePersonalChange('residingDistrict', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="homeAddress">Home Address *</Label>
                  <Input
                    id="homeAddress"
                    value={personalData.homeAddress}
                    onChange={(e) => handlePersonalChange('homeAddress', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="residingProvince">Residing Province *</Label>
                  <Select value={personalData.residingProvince} onValueChange={(v) => handlePersonalChange('residingProvince', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="privateEmail">Private Email *</Label>
                  <Input
                    id="privateEmail"
                    type="email"
                    value={personalData.privateEmail}
                    onChange={(e) => handlePersonalChange('privateEmail', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nextOfKin">Next of Kin *</Label>
                  <Input
                    id="nextOfKin"
                    value={personalData.nextOfKin}
                    onChange={(e) => handlePersonalChange('nextOfKin', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="relationToNextOfKin">Relation to Next of Kin *</Label>
                  <Input
                    id="relationToNextOfKin"
                    value={personalData.relationToNextOfKin}
                    onChange={(e) => handlePersonalChange('relationToNextOfKin', e.target.value)}
                    placeholder="e.g., Father, Mother"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nextOfKinContact">Next of Kin Phone/Email Contact *</Label>
                  <Input
                    id="nextOfKinContact"
                    value={personalData.nextOfKinContact}
                    onChange={(e) => handlePersonalChange('nextOfKinContact', e.target.value)}
                    placeholder="+675 XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nearestAirport">Nearest Airport</Label>
                  <Input
                    id="nearestAirport"
                    value={personalData.nearestAirport}
                    onChange={(e) => handlePersonalChange('nearestAirport', e.target.value)}
                    placeholder="e.g., Jackson's Airport"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    value={personalData.nationality}
                    onChange={(e) => handlePersonalChange('nationality', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">ENTRY QUALIFICATION</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondarySchool">Secondary School *</Label>
                    <Input
                      id="secondarySchool"
                      value={personalData.secondarySchool}
                      onChange={(e) => handlePersonalChange('secondarySchool', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="matriculationCentre">Matriculation Centre</Label>
                    <Input
                      id="matriculationCentre"
                      value={personalData.matriculationCentre}
                      onChange={(e) => handlePersonalChange('matriculationCentre', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: ACADEMIC */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Section 2: ACADEMIC
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="programCode">Program Code *</Label>
                  <Input
                    id="programCode"
                    value={academicData.programCode}
                    onChange={(e) => setAcademicData(prev => ({ ...prev, programCode: e.target.value }))}
                    placeholder="e.g., ENV-BSC"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Input
                    id="level"
                    value={academicData.level}
                    onChange={(e) => setAcademicData(prev => ({ ...prev, level: e.target.value }))}
                    placeholder="e.g., Year 1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="strand">Strand</Label>
                  <Input
                    id="strand"
                    value={academicData.strand}
                    onChange={(e) => setAcademicData(prev => ({ ...prev, strand: e.target.value }))}
                    placeholder="e.g., General"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">First Semester Courses</h3>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Label className="w-24">Course {index + 1}:</Label>
                        <Input
                          value={academicData.firstSemesterCourses[index]}
                          onChange={(e) => handleCourseChange('first', index, e.target.value)}
                          placeholder="e.g., ENV101 - Introduction to Environmental Science"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Second Semester Courses</h3>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Label className="w-24">Course {index + 1}:</Label>
                        <Input
                          value={academicData.secondSemesterCourses[index]}
                          onChange={(e) => handleCourseChange('second', index, e.target.value)}
                          placeholder="e.g., ENV102 - Environmental Chemistry"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: FINANCIAL */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Section 3: FINANCIAL
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Resident Type *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="residentType"
                          value="resident"
                          checked={financialData.residentType === 'resident'}
                          onChange={(e) => setFinancialData(prev => ({ ...prev, residentType: e.target.value }))}
                        />
                        <span>Resident</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="residentType"
                          value="non-resident"
                          checked={financialData.residentType === 'non-resident'}
                          onChange={(e) => setFinancialData(prev => ({ ...prev, residentType: e.target.value }))}
                        />
                        <span>Non-Resident</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sponsor">Sponsor</Label>
                    <Input
                      id="sponsor"
                      value={financialData.sponsor}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, sponsor: e.target.value }))}
                      placeholder="e.g., Self, Parents, Company"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amountPaid">Amount Paid (K) *</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      step="0.01"
                      value={financialData.amountPaid}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, amountPaid: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="receiptNumber">Receipt No *</Label>
                    <Input
                      id="receiptNumber"
                      value={financialData.receiptNumber}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dormitory">Dormitory</Label>
                    <Input
                      id="dormitory"
                      value={financialData.dormitory}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, dormitory: e.target.value }))}
                      placeholder="e.g., Block A"
                    />
                  </div>

                  <div>
                    <Label htmlFor="roomNumber">Room No</Label>
                    <Input
                      id="roomNumber"
                      value={financialData.roomNumber}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, roomNumber: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="libraryNumber">Library No</Label>
                    <Input
                      id="libraryNumber"
                      value={financialData.libraryNumber}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, libraryNumber: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mealNumber">Meal No</Label>
                    <Input
                      id="mealNumber"
                      value={financialData.mealNumber}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, mealNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">2025 Fee Structure</h3>
                {feeBreakdown.total > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tuition Fee:</span>
                      <span className="font-semibold">K {feeBreakdown.tuition.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Compulsory Fees:</span>
                      <span className="font-semibold">K {feeBreakdown.compulsory.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="text-xs text-gray-600 ml-4">
                      <div>• Clinical Services: K 160.50</div>
                      <div>• Student Association: K 53.50</div>
                      <div>• Academic Resources: K 321.00</div>
                      <div>• IT Levy: K 32.10</div>
                      <div>• Insurance: K 321.00</div>
                      <div>• Repairs & Maintenance: K 321.00</div>
                    </div>
                    {feeBreakdown.boarding > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Boarding & Lodging:</span>
                        <span className="font-semibold">K {feeBreakdown.boarding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-blue-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">TOTAL:</span>
                        <span className="text-lg font-bold text-green-700">K {feeBreakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    {financialData.residentType === 'non-resident' && (
                      <div className="mt-2 text-xs text-blue-700">
                        <strong>Note:</strong> Non-residential students do not pay boarding fees
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">Loading fee structure...</div>
                )}
              </div>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold mb-3">UNIVERSITY FEES PAYMENT</h3>
                <p className="text-sm text-gray-600 mb-3">Check if you have already made payment:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="compulsoryFees"
                      checked={financialData.compulsoryFeesPaid}
                      onCheckedChange={(checked) => setFinancialData(prev => ({ ...prev, compulsoryFeesPaid: checked as boolean }))}
                    />
                    <Label htmlFor="compulsoryFees" className="cursor-pointer">
                      Compulsory Fees 100% Paid? (K {(feeBreakdown.tuition + feeBreakdown.compulsory).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="boardingFees"
                      checked={financialData.boardingFeesPaid}
                      onCheckedChange={(checked) => setFinancialData(prev => ({ ...prev, boardingFeesPaid: checked as boolean }))}
                    />
                    <Label htmlFor="boardingFees" className="cursor-pointer">
                      Boarding & Lodging Fees 50% and Above Paid? (K {(feeBreakdown.boarding / 2).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: DECLARATION */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Section 4: DECLARATION
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    I certify that the above information is correct. Should any of the information change
                    during the semester, I will immediately inform the Senior Assistant Registrar's (SA) office.
                  </p>
                  <p className="text-sm text-gray-700">
                    I do solemnly promise that I will faithfully obey the Statues, By Laws, Rules and Regulations
                    of the University so far as they apply to me.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox
                    id="declaration"
                    checked={declarationData.agreed}
                    onCheckedChange={(checked) => setDeclarationData(prev => ({ ...prev, agreed: checked as boolean }))}
                  />
                  <Label htmlFor="declaration" className="cursor-pointer text-sm">
                    I agree to the above declaration and confirm that all information provided is accurate *
                  </Label>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="signature">Signed (Full Name) *</Label>
                    <Input
                      id="signature"
                      value={declarationData.signature}
                      onChange={(e) => setDeclarationData(prev => ({ ...prev, signature: e.target.value }))}
                      placeholder="Type your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={declarationData.date}
                      onChange={(e) => setDeclarationData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="witness">Witness</Label>
                    <Input
                      id="witness"
                      value={declarationData.witness}
                      onChange={(e) => setDeclarationData(prev => ({ ...prev, witness: e.target.value }))}
                      placeholder="Witness name"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/portal/student')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !declarationData.agreed}
              className="bg-emerald-600 hover:bg-emerald-700"
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
          </div>
        </form>
      </div>
    </div>
  );
}
