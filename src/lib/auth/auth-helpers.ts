import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign in with email and OTP
export async function signInWithOTP(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

// Verify OTP code
export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  return { data, error };
}

// Sign in with Microsoft Azure AD
export async function signInWithMicrosoft() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile openid',
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user details from our users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error('Error fetching user data:', userError);
    return null;
  }

  return {
    ...user,
    ...userData,
  };
}

// Get current student (if user is a student)
export async function getCurrentStudent() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'student') {
    return null;
  }

  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching student data:', error);
    return null;
  }

  return {
    ...user,
    ...student,
  };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Check if user is authenticated
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Get user role
export async function getUserRole() {
  const user = await getCurrentUser();
  return user?.role || null;
}
