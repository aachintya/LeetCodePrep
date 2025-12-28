import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
    const { data, user, logout, loginWithGoogle, solvedQuestions, filters, authLoading } = useApp();

    // Get unique question count for current timeframe
    const getQuestionCount = () => {
        if (!data?.uniqueQuestions) return '-';
        return (data.uniqueQuestions[filters.timeframe] || data.uniqueQuestions['all'] || 0).toLocaleString();
    };

    // Get companies count that have data for the current timeframe
    const getCompanyCount = () => {
        if (!data?.companies) return '-';
        const count = data.companies.filter(c => c.timeframes[filters.timeframe]).length;
        return count > 0 ? count.toLocaleString() : data.totalCompanies.toLocaleString();
    };

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <span className="logo-icon">⚡</span>
                    <h1>LeetCode <span className="accent">Company</span> Questions</h1>
                </Link>

                <div className="header-right">
                    <div className="header-stats">
                        <div className="stat">
                            <span className="stat-value">{getCompanyCount()}</span>
                            <span className="stat-label">Companies</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{getQuestionCount()}</span>
                            <span className="stat-label">Questions</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value solved">{solvedQuestions.size.toLocaleString()}</span>
                            <span className="stat-label">Solved</span>
                        </div>
                    </div>

                    {authLoading ? (
                        <span className="auth-loading">...</span>
                    ) : user ? (
                        <div className="user-section">
                            {user.photo ? (
                                <img src={user.photo} alt="" className="user-photo" />
                            ) : (
                                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                            <span className="user-name">{user.name}</span>
                            <button className="logout-btn" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <button className="auth-btn google-btn" onClick={handleLogin}>
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
