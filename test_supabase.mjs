import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bhceoxbaoivwurshfkku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2VveGJhb2l2d3Vyc2hma2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjY0MzMsImV4cCI6MjA5NTIwMjQzM30.ZZMDeHOiZ6t_KxMuAa7cnTjzF5WWJ-i08SRG8jkLD84';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    console.log('=== Supabase Connection Test ===\n');

    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity...');
    try {
        const { data, error } = await supabase.from('game_rooms').select('id').limit(1);
        if (error) {
            console.log('   ERROR:', error.message);
            console.log('   Code:', error.code);
            console.log('   Details:', error.details);
            console.log('   Hint:', error.hint);
        } else {
            console.log('   SUCCESS: Table is accessible');
            console.log('   Rows found:', data?.length ?? 0);
        }
    } catch (e) {
        console.log('   EXCEPTION:', e.message);
    }

    // Test 2: Try inserting a room
    console.log('\n2. Testing INSERT (create room)...');
    try {
        const { data, error } = await supabase
            .from('game_rooms')
            .insert({
                room_code: 'TEST1',
                player_x: 'test_player_123',
                status: 'waiting',
            })
            .select()
            .single();

        if (error) {
            console.log('   INSERT ERROR:', error.message);
            console.log('   Code:', error.code);
            console.log('   Details:', error.details);
            console.log('   Hint:', error.hint);
        } else {
            console.log('   SUCCESS: Room created!');
            console.log('   Room ID:', data.id);
            console.log('   Room Code:', data.room_code);

            // Clean up test room
            const { error: deleteError } = await supabase
                .from('game_rooms')
                .delete()
                .eq('id', data.id);
            if (deleteError) {
                console.log('   (cleanup failed:', deleteError.message, ')');
            } else {
                console.log('   (cleaned up test room)');
            }
        }
    } catch (e) {
        console.log('   EXCEPTION:', e.message);
    }

    // Test 3: Check table schema
    console.log('\n3. Testing SELECT * to inspect columns...');
    try {
        const { data, error } = await supabase.from('game_rooms').select('*').limit(1);
        if (error) {
            console.log('   ERROR:', error.message);
        } else if (data && data.length > 0) {
            console.log('   Columns:', Object.keys(data[0]).join(', '));
        } else {
            console.log('   Table is empty (no rows to inspect columns)');
        }
    } catch (e) {
        console.log('   EXCEPTION:', e.message);
    }

    console.log('\n=== Test Complete ===');
}

testConnection();
