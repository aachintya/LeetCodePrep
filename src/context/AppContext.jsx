import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    onSnapshot
} from 'firebase/firestore';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [solvedQuestions, setSolvedQuestions] = useState(new Set());
    const [filters, setFilters] = useState({
        search: '',
        difficulty: ['Easy', 'Medium', 'Hard'],
        status: 'all',
        timeframe: 'all',
        sort: 'frequency-desc'
    });

    // Load data
    useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load data:', err);
                setLoading(false);
            });
    }, []);

    // Firebase Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    email: firebaseUser.email,
                    photo: firebaseUser.photoURL
                });
            } else {
                setUser(null);
                setSolvedQuestions(new Set());
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Listen to solved questions in Firestore
    useEffect(() => {
        if (!user?.uid) return;

        const docRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.solvedQuestions) {
                    setSolvedQuestions(new Set(data.solvedQuestions));
                }
            }
        }, (error) => {
            console.error('Firestore error:', error);
            // Fallback to localStorage if Firestore fails
            const saved = localStorage.getItem(`leetcode_solved_${user.uid}`);
            if (saved) setSolvedQuestions(new Set(JSON.parse(saved)));
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Google Sign In
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Toggle solved question
    const toggleSolved = async (questionId) => {
        if (!user?.uid) return false;

        const newSolved = new Set(solvedQuestions);
        if (newSolved.has(questionId)) {
            newSolved.delete(questionId);
        } else {
            newSolved.add(questionId);
        }
        setSolvedQuestions(newSolved);

        // Save to Firestore
        try {
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, {
                solvedQuestions: [...newSolved],
                email: user.email,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Save error:', error);
            // Fallback to localStorage
            localStorage.setItem(`leetcode_solved_${user.uid}`, JSON.stringify([...newSolved]));
        }

        return true;
    };

    const updateFilters = (updates) => {
        setFilters(prev => ({ ...prev, ...updates }));
    };

    const value = {
        data,
        loading,
        user,
        authLoading,
        solvedQuestions,
        filters,
        loginWithGoogle,
        logout,
        toggleSolved,
        updateFilters
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
