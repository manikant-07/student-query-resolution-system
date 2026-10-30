import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
      },
    })
  : null;

/**
 * ==============================================================================
 * AUTHENTICATION HELPERS
 * ==============================================================================
 */

export async function signUpUser({ email, password, fullName, enrollmentNumber, department, semester, role = 'student' }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        enrollment_number: enrollmentNumber,
        department,
        semester,
        role: role.toLowerCase(),
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordForEmail(email) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please add credentials.');
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
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

export async function fetchUserProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

/**
 * ==============================================================================
 * DATABASE QUERIES & CRUD
 * ==============================================================================
 */

export async function fetchQueriesFromDB({ role, userId }) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('queries')
    .select(`
      *,
      responses:query_responses(*),
      attachments:query_attachments(*),
      history:query_status_history(*)
    `)
    .order('created_at', { ascending: false });

  // Students see only their own queries
  if (role === 'student' && userId) {
    query = query.eq('student_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching queries from DB:', error);
    throw error;
  }

  // Format to match project conventions
  return (data || []).map(q => ({
    id: q.query_number || q.id,
    dbId: q.id,
    studentId: q.student_id,
    studentName: q.student_name,
    studentRoll: q.student_roll || '23AI-104',
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
}

export async function insertQueryToDB(queryObj) {
  if (!isSupabaseConfigured) return null;

  const row = {
    query_number: queryObj.id,
    student_id: queryObj.studentId,
    student_name: queryObj.studentName,
    student_roll: queryObj.studentRoll,
    email: queryObj.email,
    title: queryObj.subject,
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

  if (error) throw error;
  return data;
}

export async function updateQueryInDB(queryId, updates) {
  if (!isSupabaseConfigured) return null;

  // Find record by query_number or id
  const { data, error } = await supabase
    .from('queries')
    .update(updates)
    .or(`query_number.eq.${queryId},id.eq.${queryId}`)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertResponseToDB({ queryDbId, authorId, authorName, authorRole, responseMessage, isOfficial = true }) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('query_responses')
    .insert([{
      query_id: queryDbId,
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

  const { data, error } = await supabase
    .from('query_status_history')
    .insert([{
      query_id: queryDbId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      changed_by_name: changedByName,
      remarks,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * ==============================================================================
 * FACULTY DIRECTORY & CSP WORKLOADS
 * ==============================================================================
 */

export async function fetchFacultyFromDB() {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching faculty:', error);
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

  const { data, error } = await supabase
    .from('faculty')
    .update(updates)
    .eq('id', facultyId)
    .select()
    .single();

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
    console.error('Error fetching knowledge rules:', error);
    return [];
  }

  return data || [];
}

export async function updateKnowledgeRuleInDB(ruleId, updates) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('knowledge_rules')
    .update(updates)
    .eq('id', ruleId)
    .select()
    .single();

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

  const { error } = await supabase
    .from('knowledge_rules')
    .delete()
    .eq('id', ruleId);

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
    console.error('Error fetching notifications:', error);
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

  if (error) console.error('Error marking notification read:', error);
}

export async function createNotificationInDB({ userId, queryId, message }) {
  if (!isSupabaseConfigured || !userId) return null;

  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      query_id: queryId,
      message,
      is_read: false,
    }])
    .select()
    .single();

  if (error) console.error('Error creating notification:', error);
  return data;
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

  const fileExt = file.name.split('.').pop();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${queryDbId || 'temp'}/${Date.now()}_${safeName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('query-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Insert metadata into public.query_attachments table
  if (queryDbId) {
    const { data: recordData, error: recordError } = await supabase
      .from('query_attachments')
      .insert([{
        query_id: queryDbId,
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

  // Create signed URL valid for 60 minutes
  const { data, error } = await supabase.storage
    .from('query-attachments')
    .createSignedUrl(filePath, 3600);

  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
  return data.signedUrl;
}
