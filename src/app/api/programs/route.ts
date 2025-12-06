import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: programs, error } = await supabase
      .from('programs')
      .select('id, program_name, program_code, degree_level')
      .eq('is_active', true)
      .order('program_name');

    if (error) {
      console.error('Error fetching programs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch programs' },
        { status: 500 }
      );
    }

    // Format programs for the form
    const formattedPrograms = programs.map(p => ({
      id: p.id,
      name: `${p.program_name} (${p.degree_level})`,
    }));

    return NextResponse.json({ programs: formattedPrograms });
  } catch (error) {
    console.error('Programs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
