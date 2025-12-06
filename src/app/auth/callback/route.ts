import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo');

  if (code) {
    const supabase = createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`);
    }

    if (data.user) {
      // Fetch user role from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, first_name, last_name')
        .eq('id', data.user.id)
        .single();

      // Update last login
      if (!userError && userData) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        // Redirect based on role
        // Use redirectTo if provided, otherwise use role-based routing
        let redirectPath = redirectTo;

        if (!redirectPath) {
          const roleRoutes: Record<string, string> = {
            student: '/portal/student',
            registrar: '/portal/registrar',
            admissions: '/portal/admissions',
            finance: '/portal/finance',
            ict_admin: '/portal/admin',
            department_head: '/portal/academic',
            academic_advisor: '/portal/academic',
            dean: '/portal/academic',
            student_services: '/portal/services',
            clinic_staff: '/portal/clinic',
            librarian: '/portal/library',
            pr_staff: '/portal/pr',
            bookshop_staff: '/portal/bookshop',
          };

          redirectPath = roleRoutes[userData.role] || '/portal/student';
        }

        return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
      }

      // If no user data found, redirect to student portal as default
      return NextResponse.redirect(`${requestUrl.origin}/portal/student`);
    }
  }

  // If no code or authentication failed, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
}
