'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const supabase = createClient();
      
      if (!supabase) {
        throw new Error('Supabase client not created');
      }

      const { data, error } = await supabase
        .from('programs')
        .select('count')
        .limit(1);

      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setStatus('connected');
          setMessage('Supabase connected! Database tables need to be created.');
          setDetails({
            connectionStatus: 'Connected',
            databaseStatus: 'Tables not created yet',
            nextStep: 'Run the SQL setup script in Supabase SQL Editor'
          });
        } else {
          throw error;
        }
      } else {
        setStatus('connected');
        setMessage('Supabase fully connected and database is set up!');
        setDetails({
          connectionStatus: 'Connected',
          databaseStatus: 'Tables created',
          dataFound: data ? 'Yes' : 'No'
        });
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('Connection failed');
      setDetails({
        error: error.message,
        hint: 'Check your .env.local file'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === 'testing' && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
              {status === 'connected' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
              Supabase Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="font-semibold text-lg">{message}</p>
            </div>

            {details && (
              <div className="space-y-2">
                <h3 className="font-semibold">Test Results:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Open Supabase Dashboard</li>
                <li>Go to SQL Editor</li>
                <li>Copy content from .same/supabase-setup.sql</li>
                <li>Paste and run in SQL Editor</li>
                <li>Follow .same/SUPABASE_SETUP_GUIDE.md</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
