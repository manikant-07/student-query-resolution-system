import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialQueries } from '../data/initialQueries';
import { initialFAQs } from '../data/initialFAQs';
import { facultyList } from '../data/facultyList';
import { evaluateExpertRules, calculateKeywordRelevance, tokenizeText } from '../utils/aiEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  // LocalStorage keys
  const STORAGE_KEYS = {
    QUERIES: 'ai_pbl_queries_v2',
    FAQS: 'ai_pbl_faqs_v2',
    FACULTY: 'ai_pbl_faculty_v2',
    ROLE: 'ai_pbl_role_v2',
    THEME: 'ai_pbl_theme_v2'
  };

  // Queries state
  const [queries, setQueries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUERIES);
      return saved ? JSON.parse(saved) : initialQueries;
    } catch {
      return initialQueries;
    }
  });

  // FAQs state
  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : initialFAQs;
    } catch {
      return initialFAQs;
    }
  });

  // Faculty state
  const [faculty, setFaculty] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
      return saved ? JSON.parse(saved) : facultyList;
    } catch {
      return facultyList;
    }
  });

  // Role state: 'student' or 'faculty'
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ROLE) || 'student';
    } catch {
      return 'student';
    }
  });

  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Keep DOM in sync with theme state immediately
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
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

  // Active Users
  const studentUser = {
    name: "Manikant Kumar",
    roll: "23AI-104",
    email: "manikant.ai@college.edu",
    branch: "Artificial Intelligence & Data Science",
    year: "2nd Year"
  };

  const facultyUser = {
    name: "Prof. Rajesh Sharma",
    role: "Senior Professor & HOD",
    department: "Artificial Intelligence & Data Science",
    email: "rajesh.sharma@college.edu"
  };

  // UI States
  const [toasts, setToasts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries));
  }, [queries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add new Query with AI analysis
  const submitQuery = (formData) => {
    const aiAnalysis = evaluateExpertRules(formData);
    const newId = `QRY-${1000 + queries.length + 1}`;

    const newQuery = {
      id: newId,
      studentName: studentUser.name,
      studentRoll: studentUser.roll,
      email: studentUser.email,
      subject: formData.subject,
      category: formData.category,
      description: formData.description,
      priority: formData.priority || 'Medium',
      status: 'Pending',
      tags: formData.tags || [formData.category.toLowerCase()],
      createdAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      assignedDept: formData.category === 'Attendance' ? 'Artificial Intelligence & Data Science' :
                    formData.category === 'Exams' ? 'Examination Branch' :
                    formData.category === 'Fees' ? 'Accounts & Finance Office' :
                    formData.category === 'Timetable' ? 'Academic Scheduling Committee' :
                    formData.category === 'Technical' ? 'IT & Campus Infrastructure' : 'Dean of Student Welfare',
      suggestedAnswer: aiAnalysis.conclusion,
      certaintyScore: aiAnalysis.certaintyScore,
      matchedRule: aiAnalysis.ruleFired,
      explanation: aiAnalysis.explanation,
      replies: [],
      feedback: { helpful: 0, notHelpful: 0, userVoted: null }
    };

    setQueries(prev => [newQuery, ...prev]);
    showToast(`Query ${newId} submitted successfully! AI evaluation attached.`, 'success');
    return newQuery;
  };

  // Faculty reply to query
  const replyToQuery = (queryId, message, newStatus = null) => {
    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        const replyObj = {
          id: `rep-${Date.now()}`,
          author: facultyUser.name,
          role: facultyUser.role,
          message,
          timestamp: new Date().toISOString()
        };
        return {
          ...q,
          status: newStatus || (q.status === 'Pending' ? 'Answered' : q.status),
          replies: [...(q.replies || []), replyObj]
        };
      }
      return q;
    }));
    showToast(`Reply posted to ${queryId}. Status updated.`, 'success');
  };

  // Update query status
  const updateQueryStatus = (queryId, newStatus) => {
    setQueries(prev => prev.map(q => q.id === queryId ? { ...q, status: newStatus } : q));
    showToast(`Status of ${queryId} changed to ${newStatus}.`, 'info');
  };

  // Assign query to faculty/dept
  const assignQuery = (queryId, facultyName, departmentName) => {
    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return {
          ...q,
          assignedTo: facultyName,
          assignedDept: departmentName || q.assignedDept
        };
      }
      return q;
    }));

    // Update faculty current load count
    setFaculty(prev => prev.map(f => {
      if (f.name === facultyName) {
        return { ...f, currentLoad: f.currentLoad + 1 };
      }
      return f;
    }));

    showToast(`Query ${queryId} assigned to ${facultyName}.`, 'success');
  };

  // Apply batch assignments (from CSP solver)
  const applyCSPAssignments = (assignmentsMap) => {
    let count = 0;
    setQueries(prev => prev.map(q => {
      if (assignmentsMap[q.id]) {
        count++;
        return { ...q, assignedTo: assignmentsMap[q.id] };
      }
      return q;
    }));
    showToast(`CSP Algorithm assigned ${count} queries to eligible faculty!`, 'success');
  };

  // Helpful / Not Helpful feedback
  const voteQueryFeedback = (queryId, isHelpful) => {
    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        const currentFeedback = q.feedback || { helpful: 0, notHelpful: 0, userVoted: null };
        if (currentFeedback.userVoted === (isHelpful ? 'helpful' : 'notHelpful')) {
          return q; // already voted same
        }
        return {
          ...q,
          feedback: {
            helpful: isHelpful ? currentFeedback.helpful + 1 : Math.max(0, currentFeedback.helpful - (currentFeedback.userVoted === 'helpful' ? 1 : 0)),
            notHelpful: !isHelpful ? currentFeedback.notHelpful + 1 : Math.max(0, currentFeedback.notHelpful - (currentFeedback.userVoted === 'notHelpful' ? 1 : 0)),
            userVoted: isHelpful ? 'helpful' : 'notHelpful'
          }
        };
      }
      return q;
    }));
    showToast("Thank you for your feedback!", "success");
  };

  // Reset to default sample data
  const resetDemoData = () => {
    if (window.confirm("Are you sure you want to reset all data to default demo records?")) {
      setQueries(initialQueries);
      setFaqs(initialFAQs);
      setFaculty(facultyList);
      localStorage.removeItem(STORAGE_KEYS.QUERIES);
      localStorage.removeItem(STORAGE_KEYS.FAQS);
      localStorage.removeItem(STORAGE_KEYS.FACULTY);
      showToast("Demo data reset to original state.", "info");
    }
  };

  return (
    <AppContext.Provider
      value={{
        queries,
        faqs,
        faculty,
        role,
        setRole,
        studentUser,
        facultyUser,
        toasts,
        showToast,
        removeToast,
        submitQuery,
        replyToQuery,
        updateQueryStatus,
        assignQuery,
        applyCSPAssignments,
        voteQueryFeedback,
        resetDemoData,
        mobileMenuOpen,
        setMobileMenuOpen,
        theme,
        setTheme,
        toggleTheme
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
