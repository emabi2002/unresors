'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMicrosoftSignIn = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      // Get redirectTo parameter from URL if present
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirectTo') || '';

      const callbackUrl = redirectTo
        ? `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
        : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid',
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account', // Allow user to select account
          }
        }
      });

      if (error) {
        toast.error('Failed to sign in with Microsoft. Please try again.');
        console.error('Microsoft sign-in error:', error);
        setLoading(false);
        return;
      }

      // Redirect happens automatically
    } catch (error: any) {
      toast.error('Authentication error. Please contact ICT support.');
      console.error('Sign-in error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-600 p-3 rounded-full">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Welcome to UNRE</h1>
            <p className="text-emerald-700">Sign in with your Office 365 account</p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <GraduationCap className="mr-2 h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Staff
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Sign In</CardTitle>
                  <CardDescription>
                    Use your UNRE student email (@student.unre.edu.pg)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleMicrosoftSignIn}
                    disabled={loading}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 flex items-center justify-center gap-3"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 23 23">
                      <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                      <rect x="12" y="1" width="10" height="10" fill="#00a4ef"/>
                      <rect x="1" y="12" width="10" height="10" fill="#7fba00"/>
                      <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                    </svg>
                    <span className="font-semibold">
                      {loading ? 'Signing in...' : 'Sign in with Microsoft'}
                    </span>
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Don't have a student account?{' '}
                      <Link href="/apply" className="text-emerald-600 hover:underline font-medium">
                        Apply Now
                      </Link>
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>Students:</strong> Use your student email address (e.g., john.doe@student.unre.edu.pg)
                      with your Office 365 password.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Sign In</CardTitle>
                  <CardDescription>
                    Use your UNRE institutional email (@unre.edu.pg)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleMicrosoftSignIn}
                    disabled={loading}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 flex items-center justify-center gap-3"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 23 23">
                      <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                      <rect x="12" y="1" width="10" height="10" fill="#00a4ef"/>
                      <rect x="1" y="12" width="10" height="10" fill="#7fba00"/>
                      <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                    </svg>
                    <span className="font-semibold">
                      {loading ? 'Signing in...' : 'Sign in with Microsoft'}
                    </span>
                  </Button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>Staff:</strong> Use your institutional email address (e.g., john.doe@unre.edu.pg)
                      with your Office 365 credentials.
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> All UNRE staff use Single Sign-On (SSO) with Office 365.
                      Your dashboard access is determined by your role in the system.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Having trouble signing in?{' '}
              <a href="mailto:ict@unre.edu.pg" className="text-emerald-600 hover:underline">
                Contact ICT Support
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Secured by Microsoft Azure Active Directory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
