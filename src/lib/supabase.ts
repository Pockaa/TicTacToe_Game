import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bhceoxbaoivwurshfkku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2VveGJhb2l2d3Vyc2hma2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjY0MzMsImV4cCI6MjA5NTIwMjQzM30.ZZMDeHOiZ6t_KxMuAa7cnTjzF5WWJ-i08SRG8jkLD84';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});
