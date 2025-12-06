import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, FileText, CreditCard, BookOpen, Users, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-600 p-4 rounded-full">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-emerald-900 mb-4">
            University of Natural Resources and Environment
          </h1>
          <p className="text-xl text-emerald-700 mb-8">
            Online Student Registration System
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                Apply Now
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Student Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">New Student Application</CardTitle>
              <CardDescription>
                Apply online, upload documents, and track your application status in real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Course Registration</CardTitle>
              <CardDescription>
                Register for courses, manage your academic schedule, and track prerequisites
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CreditCard className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Online Payments</CardTitle>
              <CardDescription>
                Pay tuition and fees securely via BSP Pay, Kina Bank, or card payments
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Student Portal</CardTitle>
              <CardDescription>
                Access your grades, timetable, LMS, library resources, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Secure & Private</CardTitle>
              <CardDescription>
                Enterprise-grade security with role-based access and audit trails
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Academic Services</CardTitle>
              <CardDescription>
                Academic advising, enrollment, clearances, and graduation tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Links for Staff */}
        <Card className="bg-emerald-900 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Staff & Administrator Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/portal/registrar">
                <Button variant="secondary" className="w-full bg-white text-emerald-900 hover:bg-emerald-50">
                  Registrar
                </Button>
              </Link>
              <Link href="/portal/admissions">
                <Button variant="secondary" className="w-full bg-white text-emerald-900 hover:bg-emerald-50">
                  Admissions
                </Button>
              </Link>
              <Link href="/portal/finance">
                <Button variant="secondary" className="w-full bg-white text-emerald-900 hover:bg-emerald-50">
                  Finance
                </Button>
              </Link>
              <Link href="/portal/admin">
                <Button variant="secondary" className="w-full bg-white text-emerald-900 hover:bg-emerald-50">
                  ICT Admin
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-emerald-200">
            © 2025 University of Natural Resources and Environment. All rights reserved.
          </p>
          <p className="text-emerald-300 mt-2 text-sm">
            For technical support, contact ICT Services
          </p>
        </div>
      </footer>
    </div>
  );
}
