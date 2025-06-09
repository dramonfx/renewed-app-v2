import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zisyaqerlvnblkbooekh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc3lhcWVybHZuYmxrYm9vZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjY2NzksImV4cCI6MjA2MzkwMjY3OX0.zON6P73pFl4plKCpE7c04qB9i767mDyrOBmaWWGEOO8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);