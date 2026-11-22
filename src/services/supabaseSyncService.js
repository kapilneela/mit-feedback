import { getSupabase, isSupabaseConnected } from './supabaseClient';
import {
  STUDENTS,
  COURSES,
  DEFAULT_PASSWORDS,
  FEEDBACK_QUESTIONS,
  INITIAL_RESPONSES
} from '../data/initialData';
import exactFaculty from '../data/exact_80_faculty.json';

const KEY_PASSWORDS = 'mitwpu_auth_passwords_v2';
const KEY_RESPONSES = 'mitwpu_feedback_responses_v2';
const KEY_QUESTIONS = 'mitwpu_feedback_questions_v2';
const KEY_COURSES = 'mitwpu_courses_v52';
const KEY_FACULTY = 'mitwpu_faculty_allocations_v80_exact';
const KEY_STUDENTS = 'mitwpu_students_v2200';
const KEY_SUBJECT_CONFIGS = 'mitwpu_subject_configs_v1';
const KEY_LAST_SYNC = 'mitwpu_last_supabase_sync_time';

let realtimeChannel = null;
let syncIntervalTimer = null;
let isSyncing = false;
let currentSyncState = {
  status: 'IDLE', // 'IDLE' | 'SYNCING' | 'LIVE' | 'ERROR'
  lastSyncTime: null,
  responseCount: 0,
  error: null
};

function getLocal(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

/**
 * 1. Synchronize Feedback Responses (Two-Way Merge with Deletion Tombstones)
 */
async function syncFeedbackResponses(supabase) {
  try {
    // 1. Fetch remote tombstone markers from portal_settings to respect any deletions
    const { data: settingsData } = await supabase
      .from('portal_settings')
      .select('*')
      .in('key', ['deleted_feedback_ids', 'all_feedbacks_cleared_at']);

    const tombstoneMap = new Map((settingsData || []).map(s => [s.key, s.data]));
    const deletedIdList = Array.isArray(tombstoneMap.get('deleted_feedback_ids'))
      ? tombstoneMap.get('deleted_feedback_ids')
      : [];
    const deletedIdSet = new Set(deletedIdList);
    const clearedAtStr = tombstoneMap.get('all_feedbacks_cleared_at');
    const clearedAtTime = clearedAtStr ? new Date(clearedAtStr).getTime() : 0;

    // 2. Fetch all remote responses
    const { data: remoteData, error } = await supabase
      .from('feedback_responses')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Sync] Error fetching feedback_responses:', error.message);
      return false;
    }

    // 3. Filter out any remote responses that were marked deleted or cleared
    const rawRemoteList = remoteData || [];
    const zombieRows = rawRemoteList.filter(r => 
      deletedIdSet.has(r.id) || (clearedAtTime && r.submitted_at && new Date(r.submitted_at).getTime() <= clearedAtTime)
    );

    // Prune zombie rows from Supabase table if possible
    if (zombieRows.length > 0) {
      for (const z of zombieRows) {
        supabase.from('feedback_responses').delete().eq('id', z.id).then(() => {});
      }
    }

    const remoteList = rawRemoteList
      .filter(r => !deletedIdSet.has(r.id) && (!clearedAtTime || !r.submitted_at || new Date(r.submitted_at).getTime() > clearedAtTime))
      .map(r => ({
        id: r.id,
        studentPrn: r.student_prn,
        studentName: r.student_name,
        division: r.division,
        batch: r.batch,
        courseCode: r.course_code,
        courseName: r.course_name,
        faculty: r.faculty,
        ratings: r.ratings,
        average_score: r.ratings
          ? (Object.values(r.ratings).reduce((a, b) => a + Number(b), 0) / Object.values(r.ratings).length).toFixed(1)
          : '5.0',
        comment: r.comment || '',
        submittedAt: r.submitted_at
      }));

    // 4. Read local responses, pruning any deleted ones
    const rawLocalList = getLocal(KEY_RESPONSES, INITIAL_RESPONSES);
    const localList = rawLocalList.filter(l => 
      !deletedIdSet.has(l.id) && (!clearedAtTime || !l.submittedAt || new Date(l.submittedAt).getTime() > clearedAtTime)
    );

    // 5. Find any local responses that don't exist in Supabase yet (and weren't deleted)
    const remoteIdSet = new Set(remoteList.map(r => r.id));
    const remoteKeySet = new Set(remoteList.map(r => `${r.studentPrn}__${r.courseCode}`));

    const unpushedLocal = localList.filter(l => 
      !deletedIdSet.has(l.id) &&
      (!clearedAtTime || !l.submittedAt || new Date(l.submittedAt).getTime() > clearedAtTime) &&
      !remoteIdSet.has(l.id) &&
      !remoteKeySet.has(`${l.studentPrn}__${l.courseCode}`)
    );

    // 6. Push unpushed valid local responses to Supabase
    if (unpushedLocal.length > 0) {
      for (const item of unpushedLocal) {
        try {
          await supabase.from('feedback_responses').upsert({
            id: item.id,
            student_prn: item.studentPrn,
            student_name: item.studentName,
            division: item.division,
            batch: item.batch,
            course_code: item.courseCode,
            course_name: item.courseName,
            faculty: item.faculty,
            ratings: item.ratings,
            comment: item.comment || '',
            submitted_at: item.submittedAt
          });
          remoteList.unshift(item);
        } catch (pushErr) {
          console.warn('[Supabase Sync] Error pushing unpushed response:', pushErr);
        }
      }
    }

    // 7. Deduplicate and store merged list locally (ensuring no deleted responses remain)
    const mergedMap = new Map();
    remoteList.forEach(r => {
      const key = `${r.studentPrn}__${r.courseCode}`;
      if (!mergedMap.has(key) && !deletedIdSet.has(r.id)) {
        if (!clearedAtTime || !r.submittedAt || new Date(r.submittedAt).getTime() > clearedAtTime) {
          mergedMap.set(key, r);
        }
      }
    });

    const finalMerged = Array.from(mergedMap.values());
    setLocal(KEY_RESPONSES, finalMerged);
    currentSyncState.responseCount = finalMerged.length;
    return true;
  } catch (err) {
    console.warn('[Supabase Sync] Responses sync exception:', err);
    return false;
  }
}

/**
 * 2. Synchronize Portal Settings, Faculty Allocations, Subjects & Questions
 */
async function syncPortalSettings(supabase) {
  try {
    const { data: settingsList, error } = await supabase
      .from('portal_settings')
      .select('*');

    if (error) {
      console.warn('[Supabase Sync] Error fetching portal_settings:', error.message);
      return false;
    }

    const settingsMap = new Map((settingsList || []).map(s => [s.key, s.data]));

    // A. Faculty Allocations
    if (settingsMap.has('faculty_allocations')) {
      const remoteFaculty = settingsMap.get('faculty_allocations');
      if (Array.isArray(remoteFaculty) && remoteFaculty.length > 0) {
        setLocal(KEY_FACULTY, remoteFaculty);
      }
    } else {
      // If not yet present in Supabase, push our 80 verified faculty
      const localFaculty = getLocal(KEY_FACULTY, exactFaculty);
      await supabase.from('portal_settings').upsert({
        key: 'faculty_allocations',
        data: localFaculty,
        updated_at: new Date().toISOString()
      });
    }

    // B. Auth Passwords
    if (settingsMap.has('auth_passwords')) {
      const remotePasswords = settingsMap.get('auth_passwords');
      if (remotePasswords && typeof remotePasswords === 'object') {
        const localPasswords = getLocal(KEY_PASSWORDS, DEFAULT_PASSWORDS);
        setLocal(KEY_PASSWORDS, { ...localPasswords, ...remotePasswords });
      }
    }

    // C. Subjects / Courses
    if (settingsMap.has('subjects')) {
      const remoteSubjects = settingsMap.get('subjects');
      if (Array.isArray(remoteSubjects) && remoteSubjects.length > 0) {
        setLocal(KEY_COURSES, remoteSubjects);
      }
    }

    // D. Feedback Questions
    if (settingsMap.has('feedback_questions')) {
      const remoteQuestions = settingsMap.get('feedback_questions');
      if (Array.isArray(remoteQuestions) && remoteQuestions.length > 0) {
        setLocal(KEY_QUESTIONS, remoteQuestions);
      }
    }

    // E. Subject Configs (Course Outcomes & Subject-Specific Questions)
    if (settingsMap.has('subject_configs')) {
      const remoteConfigs = settingsMap.get('subject_configs');
      if (remoteConfigs && typeof remoteConfigs === 'object') {
        const localConfigs = getLocal(KEY_SUBJECT_CONFIGS, {});
        setLocal(KEY_SUBJECT_CONFIGS, { ...localConfigs, ...remoteConfigs });
      }
    }

    // F. Apply deletions to local storage immediately if tombstones exist
    if (settingsMap.has('deleted_feedback_ids') || settingsMap.has('all_feedbacks_cleared_at')) {
      const deletedIds = new Set(Array.isArray(settingsMap.get('deleted_feedback_ids')) ? settingsMap.get('deleted_feedback_ids') : []);
      const clearedAtStr = settingsMap.get('all_feedbacks_cleared_at');
      const clearedAtTime = clearedAtStr ? new Date(clearedAtStr).getTime() : 0;

      const currentResponses = getLocal(KEY_RESPONSES, INITIAL_RESPONSES);
      const filtered = currentResponses.filter(r => 
        !deletedIds.has(r.id) && (!clearedAtTime || !r.submittedAt || new Date(r.submittedAt).getTime() > clearedAtTime)
      );

      if (filtered.length !== currentResponses.length) {
        setLocal(KEY_RESPONSES, filtered);
        currentSyncState.responseCount = filtered.length;
      }
    }

    return true;
  } catch (err) {
    console.warn('[Supabase Sync] Settings sync exception:', err);
    return false;
  }
}

/**
 * 3. Synchronize Feedback Questions
 */
async function syncFeedbackQuestions(supabase) {
  try {
    const { data, error } = await supabase
      .from('feedback_questions')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      const questions = data.map(q => ({
        id: q.id,
        category: q.category,
        question: q.text,
        type: q.type || 'rating_5'
      }));
      setLocal(KEY_QUESTIONS, questions);
      return true;
    }
  } catch (err) {
    console.warn('[Supabase Sync] Questions sync exception:', err);
  }
  return false;
}

/**
 * Perform a full two-way automatic sync with Supabase
 */
export async function syncWithSupabase() {
  if (!isSupabaseConnected()) {
    currentSyncState.status = 'LOCAL';
    return { success: false, reason: 'Supabase credentials not configured' };
  }

  const supabase = getSupabase();
  if (!supabase) return { success: false, reason: 'No Supabase instance' };

  if (isSyncing) return { success: true, reason: 'Sync already in progress' };

  isSyncing = true;
  currentSyncState.status = 'SYNCING';

  try {
    const [responsesOk, settingsOk, questionsOk] = await Promise.all([
      syncFeedbackResponses(supabase),
      syncPortalSettings(supabase),
      syncFeedbackQuestions(supabase)
    ]);

    const timestamp = new Date().toISOString();
    currentSyncState.status = 'LIVE';
    currentSyncState.lastSyncTime = timestamp;
    currentSyncState.error = null;
    localStorage.setItem(KEY_LAST_SYNC, timestamp);

    // Notify all active React views
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mitwpu_supabase_synced', {
          detail: {
            timestamp,
            responseCount: currentSyncState.responseCount,
            status: 'LIVE'
          }
        })
      );
    }

    return {
      success: true,
      timestamp,
      responsesCount: currentSyncState.responseCount
    };
  } catch (err) {
    console.error('[Supabase Sync] Full sync error:', err);
    currentSyncState.status = 'ERROR';
    currentSyncState.error = err.message;
    return { success: false, error: err.message };
  } finally {
    isSyncing = false;
  }
}

/**
 * Setup Realtime WebSocket Listener for instant multi-user synchronization
 */
export function setupSupabaseRealtime() {
  if (!isSupabaseConnected()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  if (realtimeChannel) {
    return realtimeChannel;
  }

  try {
    realtimeChannel = supabase
      .channel('mitwpu_portal_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback_responses' },
        async (payload) => {
          console.log('[Supabase Realtime] Feedback event detected:', payload.eventType);
          await syncFeedbackResponses(supabase);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', { detail: { event: payload.eventType } }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portal_settings' },
        async (payload) => {
          console.log('[Supabase Realtime] Settings event detected:', payload.eventType);
          await syncPortalSettings(supabase);
          await syncFeedbackResponses(supabase);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mitwpu_supabase_synced', { detail: { event: payload.eventType } }));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          currentSyncState.status = 'LIVE';
          console.log('[Supabase Realtime] Successfully subscribed to live changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('[Supabase Realtime] Realtime subscription warning, falling back to background polling');
        }
      });

    return realtimeChannel;
  } catch (e) {
    console.warn('[Supabase Realtime] Could not establish realtime channel:', e);
    return null;
  }
}

/**
 * Main Entry Point: Initialize Automatic Supabase Sync
 * Starts immediate sync, connects realtime channels, and keeps periodic polling active
 */
export function initAutoSyncWithSupabase() {
  if (typeof window === 'undefined') return;

  // 1. Run initial synchronization immediately
  syncWithSupabase();

  // 2. Setup Realtime subscription
  setupSupabaseRealtime();

  // 3. Setup periodic background auto-sync interval (every 10 seconds)
  if (!syncIntervalTimer) {
    syncIntervalTimer = setInterval(() => {
      syncWithSupabase();
    }, 10000);
  }

  // 4. Trigger auto-sync when browser tab regains focus or comes online
  const onFocusOrOnline = () => {
    syncWithSupabase();
  };

  window.addEventListener('focus', onFocusOrOnline);
  window.addEventListener('online', onFocusOrOnline);

  return () => {
    if (syncIntervalTimer) {
      clearInterval(syncIntervalTimer);
      syncIntervalTimer = null;
    }
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
      realtimeChannel = null;
    }
    window.removeEventListener('focus', onFocusOrOnline);
    window.removeEventListener('online', onFocusOrOnline);
  };
}

export function getAutoSyncState() {
  return {
    ...currentSyncState,
    isConnected: isSupabaseConnected()
  };
}
