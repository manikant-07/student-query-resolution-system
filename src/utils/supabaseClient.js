import { createClient } from '@supabase/supabase-js';

// Direct static access for Vite bundler, with fallback for Node / runtime environments
const rawUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
  ? import.meta.env.VITE_SUPABASE_URL
  : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL)
    ? process.env.VITE_SUPABASE_URL
    : '';

const rawKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY)
    ? process.env.VITE_SUPABASE_ANON_KEY
    : '';

export const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
export const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Validate if environment variables are populated and not default placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('...')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : null;

/**
 * Live health check: executes a real database query against Supabase PostgreSQL
 */
export async function checkSupabaseHealth() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      status: 'missing_credentials',
      message: 'Supabase credentials are not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.'
    };
  }

  const startTime = Date.now();
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    const latency = Date.now() - startTime;

    if (error) {
      return {
        ok: false,
        status: 'database_error',
        code: error.code,
        message: `Database error (${error.code}): ${error.message}`,
        latency
      };
    }

    return {
      ok: true,
      status: 'connected',
      message: 'Connected to Supabase PostgreSQL',
      latency
    };
  } catch (err) {
    return {
      ok: false,
      status: 'connection_error',
      message: `Connection error: ${err.message}`,
      latency: Date.now() - startTime
    };
  }
}

/**
 * ==============================================================================
 * AUTHENTICATION HELPERS
 * ==============================================================================
 */

// Public student registration - role is STRICTLY student. Admin/Faculty selection forbidden.
export async function signUpUser({ email, password, fullName, enrollmentNumber, department, semester }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();
  const cleanRoll = enrollmentNumber ? enrollmentNumber.trim() : '';

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: cleanName,
        enrollment_number: cleanRoll,
        department: department || 'Artificial Intelligence & Data Science',
        semester: semester || '4th Semester',
        role: 'student', // ALWAYS strictly 'student' for public signups!
      },
    },
  });

  if (error) throw error;

  // If user session is created immediately (auto-confirmed)
  if (data?.user) {
    // Ensure profile row exists in public.profiles table
    await ensureProfileRecord({
      id: data.user.id,
      full_name: cleanName,
      email: cleanEmail,
      enrollment_number: cleanRoll,
      department: department || 'Artificial Intelligence & Data Science',
      semester: semester || '4th Semester',
      role: 'student',
    });
  }

  return data;
}

export async function signInUser({ email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error);
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

export async function resetPasswordForEmail(email) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please add credentials.');
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/#/reset-password`,
  });
  if (error) throw error;
  return data;
}

export async function updateAccountPassword(newPassword) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please add credentials.');
  }
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
}

// Google OAuth Sign-In via Supabase Auth
export async function signInWithGoogleOAuth() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured yet. Please configure credentials in .env.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

// Fetch verified user profile directly from PostgreSQL public.profiles
export async function fetchUserProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from DB:', error.message);
    }

    if (data) {
      const isComplete = data.is_profile_complete !== undefined && data.is_profile_complete !== null
        ? Boolean(data.is_profile_complete)
        : Boolean(data.enrollment_number && data.department && data.semester);

      return {
        ...data,
        is_profile_complete: isComplete,
      };
    }

    // Fallback: If profile row not found in public.profiles yet, extract from active auth user
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user && authData.user.id === userId) {
      const meta = authData.user.user_metadata || {};
      const fullName = meta.full_name || meta.name || authData.user.email?.split('@')[0] || 'Student';
      const avatarUrl = meta.avatar_url || meta.picture || null;
      const isComplete = Boolean(meta.enrollment_number && meta.department && meta.semester);

      const fallbackProfile = {
        id: userId,
        full_name: fullName,
        email: authData.user.email,
        enrollment_number: meta.enrollment_number || null,
        department: meta.department || null,
        course: meta.course || 'B.Tech - Artificial Intelligence & Data Science',
        semester: meta.semester || null,
        role: meta.role === 'admin' ? 'admin' : meta.role === 'faculty' ? 'faculty' : 'student',
        avatar_url: avatarUrl,
        is_profile_complete: isComplete,
        created_at: new Date().toISOString(),
      };

      await ensureProfileRecord(fallbackProfile);
      return fallbackProfile;
    }
  } catch (err) {
    console.error('fetchUserProfile exception:', err);
  }

  return null;
}

// Update profile row in PostgreSQL public.profiles with safe column fallback
export async function updateUserProfileInDB(userId, updates) {
  if (!isSupabaseConfigured || !userId) return null;

  try {
    // 1. Try updating with all fields
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      // If code 42703 (column course or is_profile_complete does not exist yet)
      if (error.code === '42703') {
        const safeUpdates = { ...updates };
        delete safeUpdates.course;
        delete safeUpdates.is_profile_complete;

        const { data: safeData, error: safeErr } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', userId)
          .select()
          .maybeSingle();

        if (safeErr) throw safeErr;

        // Also sync to auth user metadata so it persists across reloads
        await supabase.auth.updateUser({
          data: {
            full_name: updates.full_name,
            enrollment_number: updates.enrollment_number,
            department: updates.department,
            course: updates.course,
            semester: updates.semester,
            is_profile_complete: true,
          },
        }).catch(console.warn);

        return {
          ...safeData,
          course: updates.course,
          is_profile_complete: true,
        };
      }
      throw error;
    }

    // Also sync to auth user metadata
    await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name,
        enrollment_number: updates.enrollment_number,
        department: updates.department,
        course: updates.course,
        semester: updates.semester,
        is_profile_complete: true,
      },
    }).catch(console.warn);

    return {
      ...data,
      is_profile_complete: true,
    };
  } catch (err) {
    console.error('updateUserProfileInDB error:', err);
    throw err;
  }
}

// Check if student profile is genuinely incomplete (needs missing enrollment / department / semester)
export function isProfileIncomplete(profile, user) {
  if (!profile && !user) return false;
  // If user role is faculty or admin, they do not need student academic onboarding
  if (profile?.role && profile.role !== 'student') return false;

  const roll = profile?.enrollment_number || user?.user_metadata?.enrollment_number;
  const dept = profile?.department || user?.user_metadata?.department;
  const sem = profile?.semester || user?.user_metadata?.semester;

  // Incomplete if enrollment_number, department, or semester is missing or empty
  if (!roll || !roll.trim() || !dept || !dept.trim() || !sem || !sem.trim()) {
    return true;
  }

  return false;
}

// Ensure profile row exists in public.profiles table
export async function ensureProfileRecord(profileData) {
  if (!isSupabaseConfigured || !profileData.id) return;
  try {
    await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
  } catch (e) {
    console.warn('ensureProfileRecord error:', e);
  }
}

/**
 * ==============================================================================
 * DATABASE QUERIES & CRUD (100% POSTGRESQL BACKED)
 * ==============================================================================
 */

export async function fetchQueriesFromDB({ role, userId }) {
  if (!isSupabaseConfigured) return [];

  try {
    let queryBuilder = supabase
      .from('queries')
      .select(`
        *,
        responses:query_responses(*),
        attachments:query_attachments(*),
        history:query_status_history(*)
      `)
      .order('created_at', { ascending: false });

    // Students strictly only see their own queries
    if (role === 'student' && userId) {
      queryBuilder = queryBuilder.eq('student_id', userId);
    }

    const { data, error } = await queryBuilder;
    if (error) {
      console.error('Error fetching queries from DB:', error);
      throw error;
    }

    // Map rows cleanly to frontend model
    return (data || []).map(q => ({
      id: q.query_number || q.id,
      dbId: q.id,
      studentId: q.student_id,
      studentName: q.student_name,
      studentRoll: q.student_roll || '',
      email: q.email,
      subject: q.title,
      title: q.title,
      category: q.category,
      description: q.description,
      priority: q.priority,
      status: q.status,
      tags: q.tags || [],
      createdAt: q.created_at,
      updatedAt: q.updated_at,
      resolvedAt: q.resolved_at,
      assignedFacultyId: q.assigned_faculty_id,
      assignedTo: q.assigned_to_name || 'Unassigned',
      assignedDept: q.assigned_dept || 'Academic Cell',
      suggestedAnswer: q.ai_suggestion,
      certaintyScore: q.confidence_score ? Number(q.confidence_score) : null,
      matchedRule: q.matched_rule,
      feedback: {
        helpful: q.feedback_helpful || 0,
        notHelpful: q.feedback_not_helpful || 0,
        userVoted: null,
      },
      replies: (q.responses || []).map(r => ({
        id: r.id,
        author: r.author_name,
        role: r.author_role,
        message: r.response_message,
        timestamp: r.created_at,
        isOfficial: r.is_official,
      })),
      attachments: (q.attachments || []).map(a => ({
        id: a.id,
        fileName: a.file_name,
        filePath: a.file_path,
        fileSize: a.file_size,
        fileType: a.file_type,
        uploadedBy: a.uploaded_by,
        createdAt: a.created_at,
      })),
      statusHistory: (q.history || []).map(h => ({
        id: h.id,
        oldStatus: h.old_status,
        newStatus: h.new_status,
        changedByName: h.changed_by_name,
        remarks: h.remarks,
        createdAt: h.created_at,
      })),
    }));
  } catch (err) {
    console.error('fetchQueriesFromDB failed:', err);
    return [];
  }
}

export async function insertQueryToDB(queryObj) {
  if (!isSupabaseConfigured) return null;

  // Unique query identifier: e.g. QRY-1007
  const qNum = queryObj.id && queryObj.id.startsWith('QRY-')
    ? queryObj.id
    : `QRY-${Math.floor(1000 + Math.random() * 9000)}`;

  const row = {
    query_number: qNum,
    student_id: queryObj.studentId,
    student_name: queryObj.studentName,
    student_roll: queryObj.studentRoll || null,
    email: queryObj.email,
    title: queryObj.subject || queryObj.title,
    description: queryObj.description,
    category: queryObj.category,
    priority: queryObj.priority || 'Medium',
    status: queryObj.status || 'Pending',
    assigned_faculty_id: queryObj.assignedFacultyId || null,
    assigned_to_name: queryObj.assignedTo || 'Unassigned',
    assigned_dept: queryObj.assignedDept || 'Academic Cell',
    ai_suggestion: queryObj.suggestedAnswer || null,
    confidence_score: queryObj.certaintyScore ? Number(queryObj.certaintyScore) : null,
    matched_rule: queryObj.matchedRule || null,
    tags: queryObj.tags || [],
  };

  const { data, error } = await supabase
    .from('queries')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('Error inserting query into DB:', error);
    throw error;
  }
  return data;
}

// Safely update query by UUID or query_number without UUID casting error
export async function updateQueryInDB(queryIdentifier, updates) {
  if (!isSupabaseConfigured || !queryIdentifier) return null;

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(queryIdentifier);

  let builder = supabase.from('queries').update(updates);
  if (isUUID) {
    builder = builder.eq('id', queryIdentifier);
  } else {
    builder = builder.eq('query_number', queryIdentifier);
  }

  const { data, error } = await builder.select().maybeSingle();
  if (error) {
    console.error('Error updating query in DB:', error);
    throw error;
  }
  return data;
}

// Helper: resolve queryIdentifier to valid UUID
async function resolveQueryUuid(queryIdentifier) {
  if (!queryIdentifier) return null;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(queryIdentifier);
  if (isUUID) return queryIdentifier;

  const { data } = await supabase
    .from('queries')
    .select('id')
    .eq('query_number', queryIdentifier)
    .maybeSingle();

  return data?.id || null;
}

export async function insertResponseToDB({ queryDbId, authorId, authorName, authorRole, responseMessage, isOfficial = true }) {
  if (!isSupabaseConfigured) return null;

  const targetUuid = await resolveQueryUuid(queryDbId);
  if (!targetUuid) {
    throw new Error(`Could not resolve query identifier "${queryDbId}" to a database UUID.`);
  }

  const { data, error } = await supabase
    .from('query_responses')
    .insert([{
      query_id: targetUuid,
      author_id: authorId,
      author_name: authorName,
      author_role: authorRole,
      response_message: responseMessage,
      is_official: isOfficial,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertStatusHistoryToDB({ queryDbId, oldStatus, newStatus, changedBy, changedByName, remarks }) {
  if (!isSupabaseConfigured) return null;

  const targetUuid = await resolveQueryUuid(queryDbId);
  if (!targetUuid) return null;

  const { data, error } = await supabase
    .from('query_status_history')
    .insert([{
      query_id: targetUuid,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy || null,
      changed_by_name: changedByName,
      remarks,
    }])
    .select()
    .single();

  if (error) console.error('insertStatusHistoryToDB error:', error);
  return data;
}

/**
 * ==============================================================================
 * FACULTY DIRECTORY & WORKLOADS
 * ==============================================================================
 */

export async function fetchFacultyFromDB() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('name');

  if (error) {
    console.warn('Error fetching faculty from DB:', error.message);
    return [];
  }

  return (data || []).map(f => ({
    id: f.id,
    profileId: f.profile_id,
    name: f.name,
    email: f.email,
    role: f.role_title,
    department: f.department,
    subjects: f.specialization || [],
    currentLoad: f.current_workload || 0,
    maxLoad: f.maximum_workload || 5,
    available: f.availability_status,
  }));
}

export async function updateFacultyInDB(facultyId, updates) {
  if (!isSupabaseConfigured) return null;

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(facultyId);

  let builder = supabase.from('faculty').update(updates);
  if (isUUID) {
    builder = builder.eq('id', facultyId);
  } else {
    builder = builder.eq('name', facultyId);
  }

  const { data, error } = await builder.select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertFacultyToDB(facultyData) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('faculty')
    .insert([{
      name: facultyData.name,
      email: facultyData.email,
      role_title: facultyData.role || 'Assistant Professor',
      department: facultyData.department,
      specialization: facultyData.subjects || [],
      current_workload: 0,
      maximum_workload: facultyData.maxLoad || 5,
      availability_status: facultyData.available !== undefined ? facultyData.available : true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin-only creation of Faculty user accounts
export async function createFacultyAccountByAdmin({ name, email, password, department, roleTitle, subjects, maxLoad }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }

  // 1. First attempt to invoke secure Supabase Edge Function 'create-user'
  try {
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('create-user', {
      body: {
        email,
        password: password || 'FacultyPass@123',
        full_name: name,
        department,
        role: 'faculty',
        subjects: subjects || [],
        max_load: maxLoad || 5,
      },
    });

    if (!edgeError && edgeData?.user) {
      return edgeData;
    }
  } catch (edgeEx) {
    console.warn('Edge function unavailable, attempting direct database RPC:', edgeEx);
  }

  // 2. Fallback to database RPC function 'create_faculty_account'
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_faculty_account', {
      p_name: name,
      p_email: email,
      p_department: department,
      p_role_title: roleTitle || 'Faculty Advisor',
      p_specialization: subjects || [],
      p_maximum_workload: maxLoad || 5,
    });

    if (!rpcError && rpcData) {
      return rpcData;
    }
  } catch (rpcEx) {
    console.warn('RPC create_faculty_account warning:', rpcEx);
  }

  // 3. Fallback: Direct insert into public.faculty table
  return await insertFacultyToDB({
    name,
    email,
    role: roleTitle,
    department,
    subjects,
    maxLoad,
    available: true,
  });
}

/**
 * ==============================================================================
 * KNOWLEDGE RULES MANAGEMENT
 * ==============================================================================
 */

export async function fetchKnowledgeRulesFromDB() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('knowledge_rules')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('Error fetching knowledge rules:', error.message);
    return [];
  }

  return data || [];
}

export async function updateKnowledgeRuleInDB(ruleId, updates) {
  if (!isSupabaseConfigured) return null;

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ruleId);

  let builder = supabase.from('knowledge_rules').update(updates);
  if (isUUID) {
    builder = builder.eq('id', ruleId);
  } else {
    builder = builder.eq('rule_code', ruleId);
  }

  const { data, error } = await builder.select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertKnowledgeRuleToDB(ruleData) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('knowledge_rules')
    .insert([{
      rule_code: ruleData.rule_code,
      category: ruleData.category,
      condition: ruleData.condition,
      suggestion: ruleData.suggestion,
      description: ruleData.description,
      confidence_score: ruleData.confidence_score || 0.90,
      is_active: ruleData.is_active !== undefined ? ruleData.is_active : true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteKnowledgeRuleFromDB(ruleId) {
  if (!isSupabaseConfigured) return null;

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ruleId);

  let builder = supabase.from('knowledge_rules').delete();
  if (isUUID) {
    builder = builder.eq('id', ruleId);
  } else {
    builder = builder.eq('rule_code', ruleId);
  }

  const { error } = await builder;
  if (error) throw error;
  return true;
}

/**
 * ==============================================================================
 * NOTIFICATIONS
 * ==============================================================================
 */

export async function fetchNotificationsFromDB(userId) {
  if (!isSupabaseConfigured || !userId) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.warn('Error fetching notifications:', error.message);
    return [];
  }

  return data || [];
}

export async function markNotificationAsReadInDB(notificationId) {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) console.warn('Error marking notification read:', error.message);
}

export async function createNotificationInDB({ userId, queryId, message }) {
  if (!isSupabaseConfigured || !userId) return null;

  try {
    const targetUuid = queryId ? await resolveQueryUuid(queryId) : null;

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        query_id: targetUuid,
        message,
        is_read: false,
      }])
      .select()
      .maybeSingle();

    if (error) console.warn('Error creating notification:', error.message);
    return data;
  } catch (e) {
    console.warn('createNotificationInDB exception:', e);
    return null;
  }
}

/**
 * ==============================================================================
 * ATTACHMENT STORAGE (Supabase Storage)
 * ==============================================================================
 */

export async function uploadQueryAttachment({ file, queryDbId, userId }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase Storage is not configured.');
  }

  // Validate file size (10 MB maximum)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File exceeds maximum size of 10 MB.');
  }

  // Allowed file types: PDF, JPG, JPEG, PNG
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF, JPG, JPEG, and PNG files are allowed.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${Date.now()}_${safeName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('query-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Insert metadata into public.query_attachments table
  const targetUuid = queryDbId ? await resolveQueryUuid(queryDbId) : null;
  if (targetUuid) {
    const { data: recordData, error: recordError } = await supabase
      .from('query_attachments')
      .insert([{
        query_id: targetUuid,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: userId,
      }])
      .select()
      .single();

    if (recordError) throw recordError;
    return recordData;
  }

  return {
    file_name: file.name,
    file_path: uploadData.path,
    file_size: file.size,
    file_type: file.type,
  };
}

export async function getAttachmentDownloadUrl(filePath) {
  if (!isSupabaseConfigured || !filePath) return null;

  // Try signed URL first (valid for 60 minutes)
  const { data, error } = await supabase.storage
    .from('query-attachments')
    .createSignedUrl(filePath, 3600);

  if (!error && data?.signedUrl) {
    return data.signedUrl;
  }

  // Fallback to public URL
  const { data: pubData } = supabase.storage
    .from('query-attachments')
    .getPublicUrl(filePath);

  return pubData?.publicUrl || null;
}
