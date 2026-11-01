import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialQueries } from '../data/initialQueries';
import { initialFAQs } from '../data/initialFAQs';
import { facultyList } from '../data/facultyList';
import { knowledgeRules as defaultKnowledgeRules } from '../data/knowledgeRules';
import { evaluateExpertRules, calculateBayesianCategory } from '../utils/aiEngine';
import {
  supabase,
  isSupabaseConfigured,
  signUpUser,
  signInUser,
  signOutUser,
  resetPasswordForEmail,
  fetchUserProfile,
  fetchQueriesFromDB,
  insertQueryToDB,
  updateQueryInDB,
  insertResponseToDB,
  insertStatusHistoryToDB,
  fetchFacultyFromDB,
  updateFacultyInDB,
  insertFacultyToDB,
  createFacultyAccountByAdmin,
  fetchKnowledgeRulesFromDB,
  updateKnowledgeRuleInDB,
  insertKnowledgeRuleToDB,
  deleteKnowledgeRuleFromDB,
  fetchNotificationsFromDB,
  markNotificationAsReadInDB,
  createNotificationInDB,
  uploadQueryAttachment,
} from '../utils/supabaseClient';
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signOutFirebase,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore,
  fetchQueriesFromFirestore,
  saveQueryToFirestore,
  updateQueryInFirestore,
  auth,
} from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state: 'light' or 'dark' (purely harmless UI preference)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_pbl_theme_v2');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme attribute to HTML document root
  useEffect(() => {
    try {
      localStorage.setItem('ai_pbl_theme_v2', theme);
    } catch (e) {
      console.error(e);
    }
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth & Session States
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Fallback demo personas when Supabase is not configured or in demo mode
  const defaultStudent = {
    name: "Manikant Rajpoot",
    roll: "23AI-104",
    email: "manikant.ai@college.edu",
    branch: "Artificial Intelligence & Data Science",
    year: "2nd Year",
  };

  const defaultFaculty = {
    name: "Prof. Roshni Prasad",
    role: "Senior Professor & HOD",
    department: "Artificial Intelligence & Data Science",
    email: "roshni.prasad@college.edu",
  };

  // Active Role State: 'student' | 'faculty' | 'admin'
  const [role, setRole] = useState('student');

  // Core Data States (backed by PostgreSQL)
  const [queries, setQueries] = useState(initialQueries);
  const [faculty, setFaculty] = useState(facultyList);
  const [knowledgeRules, setKnowledgeRules] = useState(defaultKnowledgeRules);
  const [registeredStudents, setRegisteredStudents] = useState([
    { id: '1', full_name: 'Manikant Rajpoot', enrollment_number: '23AI-104', email: 'manikant.ai@college.edu', department: 'AI & Data Science', semester: '4th Semester' },
    { id: '2', full_name: 'Deep Kumar', enrollment_number: '23CS-042', email: 'deep.cs@college.edu', department: 'Computer Science', semester: '4th Semester' },
    { id: '3', full_name: 'Saksham Naagar', enrollment_number: '23IT-088', email: 'saksham.it@college.edu', department: 'Information Technology', semester: '4th Semester' },
    { id: '4', full_name: 'Harsh Shishodia', enrollment_number: '23EE-019', email: 'harsh.ee@college.edu', department: 'Electrical Engineering', semester: '4th Semester' },
    { id: '5', tactical: '23EC-071', full_name: 'Sahil Bansal', enrollment_number: '23EC-071', email: 'sahil.ec@college.edu', department: 'Electronics & Comm', semester: '4th Semester' },
    { id: '6', full_name: 'Saurabh', enrollment_number: '23ME-053', email: 'saurabh.me@college.edu', department: 'Mechanical Engineering', semester: '4th Semester' }
  ]);
  const [faqs] = useState(initialFAQs);
  const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // UI Toast notifications
  const [toasts, setToasts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 1. Initial Auth Check and Persistent Session Listener (Supabase Auth)
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          setAuthLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession warning:', error.message);
        }

        if (session?.user && isMounted) {
          setCurrentUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          if (profile && isMounted) {
            setUserProfile(profile);
            setRole(profile.role || 'student');
          }
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    restoreSession();

    let authSub = null;
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setCurrentUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          if (profile && isMounted) {
            setUserProfile(profile);
            setRole(profile.role || 'student');
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setRole('student');
        }
        setAuthLoading(false);
      });
      authSub = subscription;
    }

    return () => {
      isMounted = false;
      if (authSub) authSub.unsubscribe();
    };
  }, []);

  // 2. Fetch Live Database Records (100% Supabase PostgreSQL Backed)
  const loadDatabaseData = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      setDataLoading(true);

      // A. Fetch Queries from Supabase PostgreSQL
      const dbQueries = await fetchQueriesFromDB({
        role,
        userId: currentUser?.id,
      });

      if (currentUser?.id) {
        // Authenticated users strictly see their real database inquiries
        setQueries(dbQueries);
      } else {
        // Public/guest overview
        setQueries(dbQueries && dbQueries.length > 0 ? dbQueries : initialQueries);
      }

      // B. Fetch Faculty Directory from Supabase PostgreSQL
      const dbFaculty = await fetchFacultyFromDB();
      if (dbFaculty && dbFaculty.length > 0) {
        setFaculty(dbFaculty);
      } else {
        setFaculty(facultyList);
      }

      // C. Fetch Knowledge Rules from Supabase PostgreSQL
      const dbRules = await fetchKnowledgeRulesFromDB();
      if (dbRules && dbRules.length > 0) {
        setKnowledgeRules(dbRules);
      } else {
        setKnowledgeRules(defaultKnowledgeRules);
      }

      // D. Fetch In-App Notifications from Supabase PostgreSQL
      if (currentUser?.id) {
        const dbNotifs = await fetchNotificationsFromDB(currentUser.id);
        setNotifications(dbNotifs);
      } else {
        setNotifications([]);
      }

      // E. Fetch Registered Students from Supabase PostgreSQL (if admin/faculty)
      if (role === 'admin' || role === 'faculty') {
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student')
          .order('created_at', { ascending: false });

        if (studentsData && studentsData.length > 0) {
          setRegisteredStudents(studentsData);
        }
      }
    } catch (err) {
      console.error('Error loading live DB data from Supabase:', err);
    } finally {
      setDataLoading(false);
    }
  }, [role, currentUser]);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // 3. Setup Supabase Realtime Channel
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('public:queries_and_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queries' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'query_responses' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faculty' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge_rules' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        if (currentUser?.id) {
          fetchNotificationsFromDB(currentUser.id).then(setNotifications);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, loadDatabaseData]);

  // Auth Operations
  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      // In demo mode without .env, allow instant role simulation
      const lower = email.toLowerCase();
      let detectedRole = 'student';
      if (lower.includes('admin')) detectedRole = 'admin';
      else if (lower.includes('roshni') || lower.includes('faculty') || lower.includes('prof')) detectedRole = 'faculty';

      setRole(detectedRole);
      setCurrentUser({ id: 'demo-user', email });
      setUserProfile({
        full_name: detectedRole === 'faculty' ? 'Prof. Roshni Prasad' : detectedRole === 'admin' ? 'Administrator' : 'Manikant Rajpoot',
        role: detectedRole,
        email,
      });
      showToast(`Signed in successfully as ${detectedRole.toUpperCase()} (Demo Mode)`, 'success');
      return;
    }

    const result = await signInUser({ email, password });
    if (result?.user) {
      setCurrentUser(result.user);
      const profile = await fetchUserProfile(result.user.id);
      if (profile) {
        setUserProfile(profile);
        setRole(profile.role);
      }
      showToast(`Welcome back, ${profile?.full_name || result.user.email}!`, 'success');
    }
  };

  const registerStudent = async (studentData) => {
    if (!isSupabaseConfigured) {
      showToast('Registration simulated (Demo mode). Configure .env for live PostgreSQL users.', 'info');
      return;
    }

    await signUpUser(studentData);
    showToast('Student account created! You can now log in.', 'success');
  };

  // Google Authentication via Firebase
  const loginWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const result = await signInWithGoogle();
      const user = result.user;
      const userObj = {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      setCurrentUser(userObj);

      // Check Firestore profile
      let profile = await getUserProfileFromFirestore(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          full_name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photo_url: user.photoURL || '',
          role: 'student',
          is_profile_complete: false,
          created_at: new Date().toISOString(),
        };
        await saveUserProfileToFirestore(user.uid, profile);
        setUserProfile(profile);
        setRole('student');
        setIsOnboardingModalOpen(true);
      } else {
        setUserProfile(profile);
        setRole(profile.role || 'student');
        if (!profile.is_profile_complete) {
          setIsOnboardingModalOpen(true);
        }
      }

      // Persist in localStorage for demo mode reloads if Firebase .env isn't configured
      if (!isFirebaseConfigured) {
        try {
          localStorage.setItem('ai_pbl_demo_google_session', JSON.stringify({ user: userObj, profile }));
        } catch (e) {
          console.warn(e);
        }
      }

      showToast(`Welcome, ${user.displayName || user.email}!`, 'success');
      return user;
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      showToast(err.message || 'Google Sign-In failed.', 'error');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update profile details (called after OnboardingModal or profile edit)
  const updateProfileDetails = async (details) => {
    if (!currentUser) return;
    const uid = currentUser.uid || currentUser.id;
    const merged = {
      ...userProfile,
      ...details,
      uid,
      full_name: details.full_name || userProfile?.full_name || currentUser.displayName || currentUser.email.split('@')[0],
      email: currentUser.email,
      photo_url: currentUser.photoURL || userProfile?.photo_url || '',
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    };
    const saved = await saveUserProfileToFirestore(uid, merged);
    setUserProfile(saved);
    if (saved.role) {
      setRole(saved.role);
    }

    if (!isFirebaseConfigured) {
      try {
        localStorage.setItem('ai_pbl_demo_google_session', JSON.stringify({ user: currentUser, profile: saved }));
      } catch (e) {
        console.warn(e);
      }
    }

    setIsOnboardingModalOpen(false);
    return saved;
  };

  const logout = async () => {
    try {
      await signOutFirebase();
      if (isSupabaseConfigured) {
        await signOutUser();
      }
      try {
        localStorage.removeItem('ai_pbl_demo_google_session');
      } catch (e) {
        console.warn(e);
      }
      setCurrentUser(null);
      setUserProfile(null);
      setRole('student');
      showToast('You have been logged out securely.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Error signing out', 'error');
    }
  };

  const resetUserPassword = async (email) => {
    await resetPasswordForEmail(email);
    showToast('Password reset link sent to your email.', 'info');
  };

  // 4. Submit Query with AI Evaluation & Real DB
  const submitQuery = async (formData, attachmentFile = null) => {
    const aiAnalysis = evaluateExpertRules(formData);
    const newId = `QRY-${1000 + queries.length + 1}`;

    const activeStudentName = userProfile?.full_name || defaultStudent.name;
    const activeStudentRoll = userProfile?.enrollment_number || defaultStudent.roll;
    const activeEmail = currentUser?.email || defaultStudent.email;
    const activeStudentId = currentUser?.id || 'demo-student-id';

    const newQueryObj = {
      id: newId,
      studentId: activeStudentId,
      studentName: activeStudentName,
      studentRoll: activeStudentRoll,
      email: activeEmail,
      subject: formData.subject,
      title: formData.subject,
      category: formData.category,
      description: formData.description,
      priority: formData.priority || 'Medium',
      status: 'Pending',
      tags: formData.tags || [formData.category.toLowerCase()],
      createdAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      assignedFacultyId: null,
      assignedDept: formData.category === 'Attendance' ? 'Artificial Intelligence & Data Science' :
                    formData.category === 'Exams' ? 'Examination Branch' :
                    formData.category === 'Fees' ? 'Accounts & Finance Office' :
                    formData.category === 'Timetable' ? 'Academic Scheduling Committee' :
                    formData.category === 'Technical' ? 'IT & Campus Infrastructure' : 'Hostel & Welfare Administration',
      suggestedAnswer: aiAnalysis.conclusion,
      certaintyScore: aiAnalysis.certaintyScore,
      matchedRule: aiAnalysis.ruleFired,
      explanation: aiAnalysis.explanation,
      replies: [],
      attachments: [],
      statusHistory: [{
        id: `hist-${Date.now()}`,
        oldStatus: null,
        newStatus: 'Pending',
        changedByName: activeStudentName,
        remarks: 'Initial academic query submitted',
        createdAt: new Date().toISOString()
      }],
      feedback: { helpful: 0, notHelpful: 0, userVoted: null },
    };

    // Optimistic UI update
    setQueries(prev => [newQueryObj, ...prev]);

    // Live Database Save
    if (isSupabaseConfigured && currentUser) {
      try {
        const savedQuery = await insertQueryToDB(newQueryObj);
        const queryDbId = savedQuery?.id;
        const actualQueryNumber = savedQuery?.query_number || newId;

        let uploadedAttachments = [];
        // Upload attachment to Supabase Storage if provided
        if (attachmentFile && queryDbId) {
          const uploadedAtt = await uploadQueryAttachment({
            file: attachmentFile,
            queryDbId,
            userId: currentUser.id,
          });
          if (uploadedAtt) {
            uploadedAttachments = [{
              id: uploadedAtt.id,
              fileName: uploadedAtt.file_name,
              filePath: uploadedAtt.file_path,
              fileSize: uploadedAtt.file_size,
              fileType: uploadedAtt.file_type,
            }];
          }
        }

        // Record Initial Status History in DB
        if (queryDbId) {
          await insertStatusHistoryToDB({
            queryDbId,
            oldStatus: null,
            newStatus: 'Pending',
            changedBy: currentUser.id,
            changedByName: activeStudentName,
            remarks: 'Query created by student',
          });
        }

        // Create in-app notification
        await createNotificationInDB({
          userId: currentUser.id,
          queryId: queryDbId,
          message: `Query ${actualQueryNumber} (${formData.subject}) has been successfully submitted and saved to PostgreSQL.`,
        });

        // Update queries state with the real dbId, query_number, and attachments
        setQueries(prev => prev.map(q => {
          if (q.id === newId) {
            return {
              ...q,
              id: actualQueryNumber,
              dbId: queryDbId,
              attachments: uploadedAttachments.length > 0 ? uploadedAttachments : q.attachments,
            };
          }
          return q;
        }));

        showToast(`Query ${actualQueryNumber} saved permanently in PostgreSQL! AI suggestions attached.`, 'success');

        return {
          ...newQueryObj,
          id: actualQueryNumber,
          dbId: queryDbId,
          attachments: uploadedAttachments,
        };
      } catch (err) {
        console.error('DB Insert error:', err);
        showToast('Error saving query to database: ' + err.message, 'error');
      }
    } else {
      showToast(`Query ${newId} submitted! AI evaluation attached.`, 'success');
    }

    return newQueryObj;
  };

  // 5. Faculty / Student Reply to Query
  const replyToQuery = async (queryId, message, newStatus = null, remarks = null) => {
    const authorName = userProfile?.full_name || (role === 'faculty' ? defaultFaculty.name : defaultStudent.name);
    const authorRole = role === 'faculty' ? (userProfile?.role || 'Faculty') : 'Student';
    const authorId = currentUser?.id || 'demo-author-id';

    const targetQuery = queries.find(q => q.id === queryId || q.dbId === queryId);
    const resolvedStatus = newStatus || (targetQuery?.status === 'Pending' ? 'Answered' : targetQuery?.status || 'Answered');

    const newReply = {
      id: `rep-${Date.now()}`,
      author: authorName,
      role: authorRole,
      message,
      timestamp: new Date().toISOString(),
      isOfficial: role === 'faculty' || role === 'admin',
    };

    // Update UI state
    setQueries(prev => prev.map(q => {
      if (q.id === queryId || q.dbId === queryId) {
        const historyEntry = resolvedStatus !== q.status ? [{
          id: `hist-${Date.now()}`,
          oldStatus: q.status,
          newStatus: resolvedStatus,
          changedByName: authorName,
          remarks: remarks || `Status set to ${resolvedStatus} with response`,
          createdAt: new Date().toISOString()
        }] : [];

        return {
          ...q,
          status: resolvedStatus,
          replies: [...(q.replies || []), newReply],
          statusHistory: [...(q.statusHistory || []), ...historyEntry]
        };
      }
      return q;
    }));

    // Save to Database
    const queryDbIdentifier = targetQuery?.dbId || targetQuery?.id || queryId;
    if (isSupabaseConfigured && queryDbIdentifier) {
      try {
        await insertResponseToDB({
          queryDbId: queryDbIdentifier,
          authorId,
          authorName,
          authorRole,
          responseMessage: message,
          isOfficial: role === 'faculty' || role === 'admin',
        });

        if (resolvedStatus !== targetQuery?.status) {
          await updateQueryInDB(queryDbIdentifier, { status: resolvedStatus });
          await insertStatusHistoryToDB({
            queryDbId: queryDbIdentifier,
            oldStatus: targetQuery?.status,
            newStatus: resolvedStatus,
            changedBy: authorId,
            changedByName: authorName,
            remarks: remarks || `Response posted: status updated to ${resolvedStatus}`,
          });
        }

        // Notify student if replied by faculty
        if ((role === 'faculty' || role === 'admin') && targetQuery?.studentId) {
          await createNotificationInDB({
            userId: targetQuery.studentId,
            queryId: queryDbIdentifier,
            message: `Faculty ${authorName} posted an official response to your query ${queryId}.`,
          });
        }

        showToast(`Official reply saved to PostgreSQL for ${queryId}.`, 'success');
      } catch (err) {
        console.error('Error saving reply to DB:', err);
        showToast('Error saving response to database: ' + err.message, 'error');
      }
    } else {
      showToast(`Reply posted to ${queryId}. Status updated.`, 'success');
    }
  };

  // 6. Update Query Status Directly
  const updateQueryStatus = async (queryId, newStatus, remarks = '') => {
    const targetQuery = queries.find(q => q.id === queryId || q.dbId === queryId);
    const changerName = userProfile?.full_name || (role === 'faculty' ? defaultFaculty.name : 'Administrator');

    setQueries(prev => prev.map(q => {
      if (q.id === queryId || q.dbId === queryId) {
        return {
          ...q,
          status: newStatus,
          statusHistory: [
            ...(q.statusHistory || []),
            {
              id: `hist-${Date.now()}`,
              oldStatus: q.status,
              newStatus,
              changedByName: changerName,
              remarks: remarks || `Status changed to ${newStatus}`,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return q;
    }));

    const queryDbIdentifier = targetQuery?.dbId || targetQuery?.id || queryId;
    if (isSupabaseConfigured && queryDbIdentifier) {
      try {
        await updateQueryInDB(queryDbIdentifier, { status: newStatus });
        await insertStatusHistoryToDB({
          queryDbId: queryDbIdentifier,
          oldStatus: targetQuery?.status,
          newStatus,
          changedBy: currentUser?.id,
          changedByName: changerName,
          remarks: remarks || `Status updated to ${newStatus}`,
        });

        if (targetQuery?.studentId) {
          await createNotificationInDB({
            userId: targetQuery.studentId,
            queryId: queryDbIdentifier,
            message: `Your query ${queryId} has been updated to "${newStatus}".`,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    showToast(`Status of ${queryId} updated to ${newStatus}.`, 'info');
  };

  // 7. Assign Query to Faculty Member
  const assignQuery = async (queryId, facultyName, departmentName) => {
    const targetQuery = queries.find(q => q.id === queryId || q.dbId === queryId);
    const assignedFac = faculty.find(f => f.name === facultyName);

    setQueries(prev => prev.map(q => {
      if (q.id === queryId || q.dbId === queryId) {
        return {
          ...q,
          assignedTo: facultyName,
          assignedFacultyId: assignedFac?.profileId || assignedFac?.id || null,
          assignedDept: departmentName || q.assignedDept,
        };
      }
      return q;
    }));

    // Update faculty load
    setFaculty(prev => prev.map(f => {
      if (f.name === facultyName) {
        return { ...f, currentLoad: (f.currentLoad || 0) + 1 };
      }
      return f;
    }));

    const queryDbIdentifier = targetQuery?.dbId || targetQuery?.id || queryId;
    if (isSupabaseConfigured && queryDbIdentifier) {
      try {
        await updateQueryInDB(queryDbIdentifier, {
          assigned_to_name: facultyName,
          assigned_dept: departmentName || targetQuery?.assignedDept,
          assigned_faculty_id: assignedFac?.profileId || null,
        });

        if (assignedFac?.id) {
          await updateFacultyInDB(assignedFac.id, {
            current_workload: (assignedFac.currentLoad || 0) + 1,
          });
        }

        if (assignedFac?.profileId) {
          await createNotificationInDB({
            userId: assignedFac.profileId,
            queryId: queryDbIdentifier,
            message: `New query ${queryId} (${targetQuery?.subject || ''}) has been assigned to you.`,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    showToast(`Query ${queryId} assigned to ${facultyName}.`, 'success');
  };

  // 8. Batch CSP Assignments
  const applyCSPAssignments = async (assignmentsMap) => {
    let count = 0;
    const entries = Object.entries(assignmentsMap);

    setQueries(prev => prev.map(q => {
      if (assignmentsMap[q.id]) {
        count++;
        return { ...q, assignedTo: assignmentsMap[q.id] };
      }
      return q;
    }));

    if (isSupabaseConfigured) {
      for (const [qId, facName] of entries) {
        const matchingQuery = queries.find(q => q.id === qId || q.dbId === qId);
        const queryDbIdentifier = matchingQuery?.dbId || matchingQuery?.id || qId;
        if (queryDbIdentifier) {
          await updateQueryInDB(queryDbIdentifier, { assigned_to_name: facName });
        }
      }
    }

    showToast(`CSP Backtracking Solver assigned ${entries.length} queries to eligible faculty!`, 'success');
  };

  // 9. Feedback vote
  const voteQueryFeedback = async (queryId, isHelpful) => {
    setQueries(prev => prev.map(q => {
      if (q.id === queryId || q.dbId === queryId) {
        const currentFeedback = q.feedback || { helpful: 0, notHelpful: 0, userVoted: null };
        if (currentFeedback.userVoted === (isHelpful ? 'helpful' : 'notHelpful')) {
          return q;
        }
        const updated = {
          helpful: isHelpful ? currentFeedback.helpful + 1 : Math.max(0, currentFeedback.helpful - (currentFeedback.userVoted === 'helpful' ? 1 : 0)),
          notHelpful: !isHelpful ? currentFeedback.notHelpful + 1 : Math.max(0, currentFeedback.notHelpful - (currentFeedback.userVoted === 'notHelpful' ? 1 : 0)),
          userVoted: isHelpful ? 'helpful' : 'notHelpful',
        };

        const queryDbIdentifier = q.dbId || q.id || queryId;
        if (isSupabaseConfigured && queryDbIdentifier) {
          updateQueryInDB(queryDbIdentifier, {
            feedback_helpful: updated.helpful,
            feedback_not_helpful: updated.notHelpful,
          }).catch(console.error);
        }

        return { ...q, feedback: updated };
      }
      return q;
    }));
    showToast("Thank you for your feedback!", "success");
  };

  // 10. Faculty Management Helpers
  const addFacultyMember = async (facultyData) => {
    const newFac = {
      id: `FAC-${Date.now()}`,
      ...facultyData,
      currentLoad: 0,
      maxLoad: facultyData.maxLoad || 5,
      available: true,
    };
    setFaculty(prev => [...prev, newFac]);

    if (isSupabaseConfigured) {
      try {
        await createFacultyAccountByAdmin(facultyData);
        const updatedFacultyList = await fetchFacultyFromDB();
        if (updatedFacultyList && updatedFacultyList.length > 0) {
          setFaculty(updatedFacultyList);
        }
        showToast(`Faculty ${facultyData.name} saved to PostgreSQL database!`, 'success');
      } catch (err) {
        showToast('Error saving faculty: ' + err.message, 'error');
      }
    } else {
      showToast(`Faculty ${facultyData.name} added.`, 'success');
    }
  };

  const updateFacultyMember = async (facultyId, updates) => {
    setFaculty(prev => prev.map(f => (f.id === facultyId || f.name === facultyId ? { ...f, ...updates } : f)));
    if (isSupabaseConfigured) {
      await updateFacultyInDB(facultyId, updates).catch(console.error);
    }
    showToast('Faculty updated successfully.', 'info');
  };

  // 11. Knowledge Rule Management Helpers
  const addRule = async (ruleData) => {
    setKnowledgeRules(prev => [...prev, ruleData]);
    if (isSupabaseConfigured) {
      try {
        await insertKnowledgeRuleToDB(ruleData);
        showToast(`Rule ${ruleData.rule_code} saved to PostgreSQL!`, 'success');
      } catch (err) {
        showToast('Error saving rule: ' + err.message, 'error');
      }
    } else {
      showToast(`Rule ${ruleData.rule_code} added.`, 'success');
    }
  };

  const updateRule = async (ruleId, updates) => {
    setKnowledgeRules(prev => prev.map(r => (r.id === ruleId || r.rule_code === ruleId ? { ...r, ...updates } : r)));
    if (isSupabaseConfigured) {
      await updateKnowledgeRuleInDB(ruleId, updates).catch(console.error);
    }
    showToast('Rule status updated.', 'info');
  };

  const deleteRule = async (ruleId) => {
    setKnowledgeRules(prev => prev.filter(r => r.id !== ruleId && r.rule_code !== ruleId));
    if (isSupabaseConfigured) {
      await deleteKnowledgeRuleFromDB(ruleId).catch(console.error);
    }
    showToast('Knowledge rule deleted.', 'info');
  };

  // 12. Notification Helpers
  const markNotificationAsRead = async (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    if (isSupabaseConfigured) {
      await markNotificationAsReadInDB(notifId);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        queries,
        faqs,
        faculty,
        knowledgeRules,
        registeredStudents,
        role,
        setRole,
        studentUser: userProfile ? {
          name: userProfile.full_name || currentUser?.displayName || defaultStudent.name,
          roll: userProfile.enrollment_number || defaultStudent.roll,
          email: userProfile.email || currentUser?.email || defaultStudent.email,
          branch: userProfile.department || userProfile.course || defaultStudent.branch,
          year: userProfile.semester || defaultStudent.year,
          photoURL: userProfile.photo_url || currentUser?.photoURL || null,
        } : (currentUser ? {
          name: currentUser.displayName || currentUser.email.split('@')[0],
          roll: 'Pending Enrollment',
          email: currentUser.email,
          branch: 'Engineering & Technology',
          year: 'Current Academic Year',
          photoURL: currentUser.photoURL || null,
        } : defaultStudent),
        facultyUser: userProfile && role === 'faculty' ? {
          name: userProfile.full_name || currentUser?.displayName || defaultFaculty.name,
          role: userProfile.specialization || 'Faculty Advisor',
          department: userProfile.department || defaultFaculty.department,
          email: userProfile.email || currentUser?.email || defaultFaculty.email,
          photoURL: userProfile.photo_url || currentUser?.photoURL || null,
        } : defaultFaculty,
        currentUser,
        userProfile,
        authLoading,
        isConfigured: isSupabaseConfigured || isFirebaseConfigured,
        isFirebaseConfigured,
        dataLoading,
        login,
        loginWithGoogle,
        updateProfileDetails,
        registerStudent,
        logout,
        resetUserPassword,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        isOnboardingModalOpen,
        openOnboardingModal: () => setIsOnboardingModalOpen(true),
        closeOnboardingModal: () => setIsOnboardingModalOpen(false),
        toasts,
        showToast,
        removeToast,
        submitQuery,
        replyToQuery,
        updateQueryStatus,
        assignQuery,
        applyCSPAssignments,
        voteQueryFeedback,
        addFacultyMember,
        updateFacultyMember,
        addRule,
        updateRule,
        deleteRule,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        refreshAllData: loadDatabaseData,
        mobileMenuOpen,
        setMobileMenuOpen,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
