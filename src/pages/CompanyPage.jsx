import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { useMemo } from 'react';

export default function CompanyPage() {
    const { slug } = useParams();
    const { data, loading, filters, solvedQuestions, toggleSolved, user, loginWithGoogle } = useApp();

    const company = useMemo(() => {
        if (!data) return null;
        return data.companies.find(c => c.slug === slug || c.name === slug);
    }, [data, slug]);

    const filteredQuestions = useMemo(() => {
        if (!company) return [];

        const timeframeData = company.timeframes[filters.timeframe] || company.timeframes['all'];
        if (!timeframeData) return [];

        let questions = [...timeframeData.questions];

        // Apply difficulty filter
        questions = questions.filter(q => filters.difficulty.includes(q.difficulty));

        // Apply status filter
        if (filters.status === 'solved') {
            questions = questions.filter(q => solvedQuestions.has(q.id));
        } else if (filters.status === 'unsolved') {
            questions = questions.filter(q => !solvedQuestions.has(q.id));
        }

        // Apply search
        if (filters.search) {
            const term = filters.search.toLowerCase();
            questions = questions.filter(q =>
                q.title.toLowerCase().includes(term) ||
                q.id.toString().includes(term)
            );
        }

        // Apply sort
        const [sortKey, sortDir] = filters.sort.split('-');
        questions.sort((a, b) => {
            let aVal, bVal;
            switch (sortKey) {
                case 'frequency': aVal = a.frequency; bVal = b.frequency; break;
                case 'difficulty':
                    const order = { Easy: 1, Medium: 2, Hard: 3 };
                    aVal = order[a.difficulty]; bVal = order[b.difficulty]; break;
                case 'acceptance': aVal = a.acceptance; bVal = b.acceptance; break;
                case 'title': aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase(); break;
                case 'id': aVal = a.id; bVal = b.id; break;
                default: aVal = a.frequency; bVal = b.frequency;
            }
            return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return questions;
    }, [company, filters, solvedQuestions]);

    const solvedCount = useMemo(() => {
        return filteredQuestions.filter(q => solvedQuestions.has(q.id)).length;
    }, [filteredQuestions, solvedQuestions]);

    const handleToggleSolved = async (id) => {
        if (!user) {
            try {
                await loginWithGoogle();
            } catch (e) {
                console.error(e);
            }
            return;
        }
        toggleSolved(id);
    };

    if (loading) {
        return (
            <main className="main">
                <div className="empty-state"><h3>Loading...</h3></div>
            </main>
        );
    }

    if (!company) {
        return (
            <main className="main">
                <div className="empty-state">
                    <h3>Company not found</h3>
                    <Link to="/" className="back-btn">← Back to Companies</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="main">
            <Sidebar showTimeframe={true} showStatus={true} />

            <div className="content">
                <div className="view-header">
                    <Link to="/" className="back-btn">← Back</Link>
                    <h2>{company.displayName}</h2>
                    <span className="results-count">
                        {filteredQuestions.length} questions • {solvedCount} solved
                    </span>
                </div>

                {filteredQuestions.length === 0 ? (
                    <div className="empty-state">
                        <h3>No questions match your filters</h3>
                        <p>Try adjusting your filter settings</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="questions-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 50 }}>Status</th>
                                    <th style={{ width: 60 }}>ID</th>
                                    <th>Title</th>
                                    <th style={{ width: 90 }}>Difficulty</th>
                                    <th style={{ width: 90 }}>Acceptance</th>
                                    <th style={{ width: 120 }}>Frequency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.map(q => {
                                    const isSolved = solvedQuestions.has(q.id);
                                    return (
                                        <tr key={q.id} className={isSolved ? 'solved-row' : ''}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="solved-checkbox"
                                                    checked={isSolved}
                                                    onChange={() => handleToggleSolved(q.id)}
                                                    title={user ? 'Mark as solved' : 'Sign in to track progress'}
                                                />
                                            </td>
                                            <td>{q.id}</td>
                                            <td>
                                                <a
                                                    href={q.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="question-link"
                                                >
                                                    {q.title}
                                                </a>
                                            </td>
                                            <td>
                                                <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                                                    {q.difficulty}
                                                </span>
                                            </td>
                                            <td>{q.acceptance.toFixed(1)}%</td>
                                            <td>
                                                <div className="frequency-cell">
                                                    <div className="frequency-bar">
                                                        <div className="frequency-fill" style={{ width: `${q.frequency}%` }}></div>
                                                    </div>
                                                    <span className="frequency-value">{q.frequency.toFixed(1)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
