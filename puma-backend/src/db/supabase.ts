import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

let supabaseClient: any;

if (url && key) {
  supabaseClient = createClient(url, key);
} else {
  console.warn('[Supabase] Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not defined. Event/feedback tracking will run in offline mock mode.');
  
  const createMock = () => {
    const mockHandler: ProxyHandler<any> = {
      get(target, prop) {
        if (prop === 'then') {
          return (onfulfilled: any) => onfulfilled({ data: null, error: { message: 'Supabase not configured' } });
        }
        return () => new Proxy({}, mockHandler);
      }
    };
    return {
      from: () => new Proxy({}, mockHandler)
    } as any;
  };
  
  supabaseClient = createMock();
}

export { supabaseClient as supabase };

