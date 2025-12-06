'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  User,
  GraduationCap,
  DollarSign,
  CheckCircle2,
  Loader2,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const PROVINCES = [
  'National Capital District', 'Central', 'Gulf', 'Milne Bay', 'Oro (Northern)',
  'Southern Highlands', 'Western Highlands', 'Enga', 'Western', 'East Sepik',
  'West Sepik (Sandaun)', 'Madang', 'Morobe', 'Eastern Highlands', 'Chimbu (Simbu)',
  'East New Britain', 'West New Britain', 'New Ireland', 'Manus', 'Bougainville',
];

const RELIGIONS = ['Christian', 'Catholic', 'Anglican', 'Lutheran', 'SDA', 'Pentecostal', 'Other'];
const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed'];
const GENDERS = ['Male', 'Female'];

export default function NewStudentRegistrationPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  // Section 1: PERSONAL (Student fills these)
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

  // Section 2: ACADEMIC (Student selects program, university allocates courses later)
  const [academicData, setAcademicData] = useState({
    programCode: '', // Student selects preferred program
    level: 'Year 1', // Auto-set for new students
    strand: '',
    // Courses will be allocated by university after approval
    firstSemesterCourses: ['', '', '', '', '', ''],
    secondSemesterCourses: ['', '', '', '', '', ''],
  });

  // Section 3: FINANCIAL (Some filled by student, some by university)
  const [financialData, setFinancialData] = useState({
    residentType: 'resident',
    sponsor: '',
    dormitory: '', // Allocated by university
    amountPaid: '',
    roomNumber: '', // Allocated by university
    receiptNumber: '',
    libraryNumber: '', // Allocated by university
    mealNumber: '', // Allocated by university
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

  // File uploads
  const [documents, setDocuments] = useState({
    grade12Certificate: null as File | null,
    academicTranscript: null as File | null,
    nationalId: null as File | null,
    passportPhoto: null as File | null,
  });

  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Fetch available programs from Supabase
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('programs')
          .select(`
            id,
            program_code,
            program_name,
            degree_level,
            duration_years,
            description,
            departments (
              department_name,
              school_name,
              school_code
            )
          `)
          .eq('is_active', true)
          .eq('degree_level', 'undergraduate')
          .order('program_code');

        if (error) {
          console.error('Error fetching programs:', error);
          toast.error('Failed to load programs');
        } else {
          setPrograms(data || []);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('Failed to load programs');
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, []);

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));

    // Auto-calculate age when DOB changes
    if (field === 'dateOfBirth' && value) {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      setPersonalData(prev => ({ ...prev, age: String(age) }));
    }
  };

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File, folder: string) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('application-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!declarationData.agreed) {
      toast.error('You must agree to the declaration before submitting');
      return;
    }

    // Validate required documents
    if (!documents.grade12Certificate || !documents.nationalId || !documents.passportPhoto) {
      toast.error('Please upload all required documents (Grade 12 Certificate, National ID, and Passport Photo)');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // Upload documents
      toast.info('Uploading documents...');

      const [grade12Url, transcriptUrl, idUrl, photoUrl] = await Promise.all([
        documents.grade12Certificate ? uploadFile(documents.grade12Certificate, 'certificates') : Promise.resolve(''),
        documents.academicTranscript ? uploadFile(documents.academicTranscript, 'transcripts') : Promise.resolve(''),
        documents.nationalId ? uploadFile(documents.nationalId, 'ids') : Promise.resolve(''),
        documents.passportPhoto ? uploadFile(documents.passportPhoto, 'photos') : Promise.resolve(''),
      ]);

      // Submit application
      toast.info('Submitting registration...');

      const applicationData = {
        // Personal Info
        first_name: personalData.firstName,
        last_name: personalData.surname,
        email: personalData.privateEmail,
        phone: personalData.nextOfKinContact,
        date_of_birth: personalData.dateOfBirth,
        gender: personalData.gender,
        nationality: personalData.nationality,
        national_id: personalData.idNumber,
        marital_status: personalData.maritalStatus,
        religion: personalData.religion,

        // Address
        province: personalData.homeProvince,
        district: personalData.residingDistrict,
        village: personalData.homeAddress,
        postal_address: personalData.homeAddress,
        residing_province: personalData.residingProvince,

        // Emergency Contact
        emergency_contact_name: personalData.nextOfKin,
        emergency_contact_relationship: personalData.relationToNextOfKin,
        emergency_contact_phone: personalData.nextOfKinContact,

        // Academic
        program_id: academicData.programCode,
        grade_12_school: personalData.secondarySchool,
        grade_12_year: new Date().getFullYear() - 1, // Approximate
        grade_12_marks: 0, // To be verified later
        matriculation_centre: personalData.matriculationCentre,

        // Additional registration fields
        slf_number: personalData.slfNumber,
        nearest_airport: personalData.nearestAirport,
        resident_type: financialData.residentType,
        sponsor: financialData.sponsor,

        // Documents
        grade_12_certificate: grade12Url,
        academic_transcript: transcriptUrl || grade12Url,
        national_id_document: idUrl,
        passport_photo: photoUrl,

        // Payment info (if any)
        amount_paid: parseFloat(financialData.amountPaid) || 0,
        receipt_number: financialData.receiptNumber,

        // Declaration
        declaration_agreed: declarationData.agreed,
        signature: declarationData.signature,
        witness: declarationData.witness,

        // Status
        application_status: 'submitted',
      };

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setApplicationId(result.applicationId);
      setSubmissionSuccess(true);
      toast.success('Registration submitted successfully!');
      toast.info('Your application is pending review by the university');

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit registration: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Submitted Successfully!</CardTitle>
            <CardDescription>Your application has been received and is pending review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="font-semibold text-lg mb-2">Application ID: {applicationId}</p>
              <p className="text-sm text-gray-600">Please save this number for your records</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>University will review your registration</li>
                <li>Admissions office will verify your documents</li>
                <li>You'll receive an email notification about your application status</li>
                <li>If approved, you'll receive:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Student ID number</li>
                    <li>Course allocations for Semester 1</li>
                    <li>Room assignment (if boarding)</li>
                    <li>Library and meal numbers</li>
                    <li>Login credentials for student portal</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="pt-4 border-t">
              <Link href="/">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-emerald-100 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">REGISTRATION OF ENROLLMENT</h1>
            <p className="text-emerald-200">New Student Registration for 2025 Academic Year</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Important Information for New Students:</p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside">
                <li>Fill in all fields you know. Fields marked "Allocated by University" will be completed after approval.</li>
                <li>Your <strong>Student ID, Course Allocations, Room Number</strong>, and other assignments will be provided by the university.</li>
                <li>Upload all required documents (Grade 12 Certificate, National ID, Passport Photo).</li>
                <li>After approval, you'll receive login credentials to complete your registration.</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: PERSONAL */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Section 1: PERSONAL INFORMATION
              </CardTitle>
              <CardDescription>Enter your personal details accurately</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    value={personalData.surname}
                    onChange={(e) => handlePersonalChange('surname', e.target.value)}
                    placeholder="As shown on ID"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">Name/First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalData.firstName}
                    onChange={(e) => handlePersonalChange('firstName', e.target.value)}
                    placeholder="Given name"
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
                  <Label htmlFor="dob">Date of Birth (DoB) *</Label>
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
                    placeholder="Auto-calculated"
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
                  <Label htmlFor="idNumber">ID No (National ID) *</Label>
                  <Input
                    id="idNumber"
                    value={personalData.idNumber}
                    onChange={(e) => handlePersonalChange('idNumber', e.target.value)}
                    placeholder="National ID Number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slfNumber">SLF No (if applicable)</Label>
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
                    placeholder="Your current district"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="homeAddress">Home Address *</Label>
                  <Input
                    id="homeAddress"
                    value={personalData.homeAddress}
                    onChange={(e) => handlePersonalChange('homeAddress', e.target.value)}
                    placeholder="Village/Town"
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
                    placeholder="your.email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nextOfKin">Next of Kin *</Label>
                  <Input
                    id="nextOfKin"
                    value={personalData.nextOfKin}
                    onChange={(e) => handlePersonalChange('nextOfKin', e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="relationToNextOfKin">Relation to Next of Kin *</Label>
                  <Input
                    id="relationToNextOfKin"
                    value={personalData.relationToNextOfKin}
                    onChange={(e) => handlePersonalChange('relationToNextOfKin', e.target.value)}
                    placeholder="e.g., Father, Mother, Guardian"
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
                      placeholder="Grade 12 School Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="matriculationCentre">Matriculation Centre</Label>
                    <Input
                      id="matriculationCentre"
                      value={personalData.matriculationCentre}
                      onChange={(e) => handlePersonalChange('matriculationCentre', e.target.value)}
                      placeholder="If attended"
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
              <CardDescription>Select your preferred program</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-3">
                  <Label htmlFor="programCode">Program Code / Preferred Program *</Label>
                  {loadingPrograms ? (
                    <div className="flex items-center justify-center py-3 text-sm text-gray-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading programs...
                    </div>
                  ) : (
                    <Select
                      value={academicData.programCode}
                      onValueChange={(v) => setAcademicData(prev => ({ ...prev, programCode: v }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">{p.program_code} - {p.program_name}</span>
                              {p.departments?.school_code && (
                                <span className="text-xs text-gray-500">{p.departments.school_name}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {programs.length === 0 && !loadingPrograms && (
                    <p className="text-sm text-red-600 mt-1">No programs available. Please contact admissions.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value="Year 1 (New Student)"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="strand">Strand (if applicable)</Label>
                  <Input
                    id="strand"
                    value={academicData.strand}
                    onChange={(e) => setAcademicData(prev => ({ ...prev, strand: e.target.value }))}
                    placeholder="e.g., Science, Arts"
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900 mb-1">Course Allocations</p>
                    <p className="text-yellow-800">
                      <strong>First Semester Courses</strong> and <strong>Second Semester Courses</strong> will be allocated by the university
                      after your application is approved based on your chosen program. You'll receive your full course schedule with your
                      admission letter.
                    </p>
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
              <CardDescription>Payment and accommodation information</CardDescription>
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
                        <span>Resident (Boarding)</span>
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
                      placeholder="e.g., Self, Parents, Company, Scholarship"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amountPaid">Amount Paid (K)</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      step="0.01"
                      value={financialData.amountPaid}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, amountPaid: e.target.value }))}
                      placeholder="If payment already made"
                    />
                  </div>

                  <div>
                    <Label htmlFor="receiptNumber">Receipt No</Label>
                    <Input
                      id="receiptNumber"
                      value={financialData.receiptNumber}
                      onChange={(e) => setFinancialData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                      placeholder="If you have a receipt"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Allocated by University:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Dormitory</strong> - Assigned after approval</li>
                      <li>• <strong>Room Number</strong> - Assigned after approval</li>
                      <li>• <strong>Library Number</strong> - Assigned after approval</li>
                      <li>• <strong>Meal Number</strong> - Assigned after approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold mb-3">UNIVERSITY FEES PAYMENT</h3>
                <p className="text-sm text-gray-600 mb-3">Check the boxes if you've already made payment:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="compulsoryFees"
                      checked={financialData.compulsoryFeesPaid}
                      onCheckedChange={(checked) => setFinancialData(prev => ({ ...prev, compulsoryFeesPaid: checked as boolean }))}
                    />
                    <Label htmlFor="compulsoryFees" className="cursor-pointer">
                      Compulsory Fees 100% Paid?
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="boardingFees"
                      checked={financialData.boardingFeesPaid}
                      onCheckedChange={(checked) => setFinancialData(prev => ({ ...prev, boardingFeesPaid: checked as boolean }))}
                    />
                    <Label htmlFor="boardingFees" className="cursor-pointer">
                      Boarding & Lodging Fees 50% and Above Paid?
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Upload Section */}
          <Card>
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Required Documents
              </CardTitle>
              <CardDescription>Upload clear scans or photos of your documents</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade12">Grade 12 Certificate *</Label>
                  <Input
                    id="grade12"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('grade12Certificate', e.target.files?.[0] || null)}
                    required
                  />
                  {documents.grade12Certificate && (
                    <Badge variant="outline" className="mt-2">
                      {documents.grade12Certificate.name}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="transcript">Academic Transcript</Label>
                  <Input
                    id="transcript"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('academicTranscript', e.target.files?.[0] || null)}
                  />
                  {documents.academicTranscript && (
                    <Badge variant="outline" className="mt-2">
                      {documents.academicTranscript.name}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('nationalId', e.target.files?.[0] || null)}
                    required
                  />
                  {documents.nationalId && (
                    <Badge variant="outline" className="mt-2">
                      {documents.nationalId.name}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="photo">Passport Photo *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('passportPhoto', e.target.files?.[0] || null)}
                    required
                  />
                  {documents.passportPhoto && (
                    <Badge variant="outline" className="mt-2">
                      {documents.passportPhoto.name}
                    </Badge>
                  )}
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
                    I do solemnly promise that I will faithfully obey the Statutes, By Laws, Rules and Regulations
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
                    <Label htmlFor="signature">Signed (Type Full Name) *</Label>
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
                    <Label htmlFor="witness">Witness (if available)</Label>
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
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={submitting || !declarationData.agreed}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Registration...
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
