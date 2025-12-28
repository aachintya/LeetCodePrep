import { useApp } from '../context/AppContext';

export default function Sidebar({ showTimeframe = true, showStatus = true }) {
    const { data, user, filters, updateFilters, solvedQuestions } = useApp();

    const toggleDifficulty = (diff) => {
        const current = filters.difficulty;
        if (current.includes(diff)) {
            updateFilters({ difficulty: current.filter(d => d !== diff) });
        } else {
            updateFilters({ difficulty: [...current, diff] });
        }
    };

    const resetFilters = () => {
        updateFilters({
            search: '',
            difficulty: ['Easy', 'Medium', 'Hard'],
            status: 'all',
            timeframe: 'all',
            sort: 'frequency-desc'
        });
    };

    const progressPercent = data ? (solvedQuestions.size / data.totalQuestions * 100) : 0;

    return (
        <aside className="sidebar">
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                />
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>

            {user && (
                <div className="filter-section progress-section">
                    <h3 className="filter-title">Your Progress</h3>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="progress-text">
                        <span>{solvedQuestions.size}</span> / {data?.totalQuestions?.toLocaleString()} solved
                    </div>
                </div>
            )}

            {showTimeframe && data?.timeframes && (
                <div className="filter-section">
                    <h3 className="filter-title">Last Asked</h3>
                    <select
                        className="timeframe-select"
                        value={filters.timeframe}
                        onChange={(e) => updateFilters({ timeframe: e.target.value })}
                    >
                        {data.timeframes.map(tf => (
                            <option key={tf.key} value={tf.key}>{tf.label}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="filter-section">
                <h3 className="filter-title">Difficulty</h3>
                <div className="filter-buttons">
                    {['Easy', 'Medium', 'Hard'].map(diff => (
                        <button
                            key={diff}
                            className={`filter-btn ${diff.toLowerCase()} ${filters.difficulty.includes(diff) ? 'active' : ''}`}
                            onClick={() => toggleDifficulty(diff)}
                        >
                            <span className="dot"></span> {diff}
                        </button>
                    ))}
                </div>
            </div>

            {showStatus && (
                <div className="filter-section">
                    <h3 className="filter-title">Status</h3>
                    <div className="filter-buttons">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'solved', label: '✓ Solved' },
                            { key: 'unsolved', label: 'Unsolved' }
                        ].map(s => (
                            <button
                                key={s.key}
                                className={`filter-btn status ${filters.status === s.key ? 'active' : ''}`}
                                onClick={() => updateFilters({ status: s.key })}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
        </aside>
    );
}
