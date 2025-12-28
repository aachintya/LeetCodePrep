import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { useMemo } from 'react';

export default function HomePage() {
    const { data, loading, filters, solvedQuestions } = useApp();

    const filteredCompanies = useMemo(() => {
        if (!data) return [];

        let companies = data.companies;

        // Filter by search
        if (filters.search) {
            const term = filters.search.toLowerCase();
            companies = companies.filter(c =>
                c.displayName.toLowerCase().includes(term) ||
                c.name.toLowerCase().includes(term)
            );
        }

        return companies;
    }, [data, filters.search]);

    const getSolvedCount = (company) => {
        const timeframeData = company.timeframes[filters.timeframe] || company.timeframes['all'];
        if (!timeframeData) return { solved: 0, total: 0 };

        let solved = 0;
        for (const q of timeframeData.questions) {
            if (solvedQuestions.has(q.id)) solved++;
        }
        return { solved, total: timeframeData.total };
    };

    const getCompanyData = (company) => {
        return company.timeframes[filters.timeframe] || company.timeframes['all'] || {
            total: company.total,
            easy: company.easy,
            medium: company.medium,
            hard: company.hard
        };
    };

    if (loading) {
        return (
            <main className="main">
                <div className="empty-state">
                    <h3>Loading...</h3>
                </div>
            </main>
        );
    }

    return (
        <main className="main">
            <Sidebar showTimeframe={true} showStatus={false} />

            <div className="content">
                <div className="view-header">
                    <h2>All Companies</h2>
                    <span className="results-count">{filteredCompanies.length} companies</span>
                </div>

                {filteredCompanies.length === 0 ? (
                    <div className="empty-state">
                        <h3>No companies found</h3>
                        <p>Try a different search term</p>
                    </div>
                ) : (
                    <div className="company-grid">
                        {filteredCompanies.map(company => {
                            const companyData = getCompanyData(company);
                            const { solved, total } = getSolvedCount(company);
                            const easyPct = (companyData.easy / companyData.total * 100) || 0;
                            const mediumPct = (companyData.medium / companyData.total * 100) || 0;
                            const hardPct = (companyData.hard / companyData.total * 100) || 0;
                            const solvedPct = total > 0 ? (solved / total * 100) : 0;

                            return (
                                <Link
                                    key={company.name}
                                    to={`/company/${company.slug}`}
                                    className="company-card"
                                >
                                    <div className="company-card-header">
                                        <span className="company-name">{company.displayName}</span>
                                        <span className="company-total">{companyData.total} questions</span>
                                    </div>
                                    <div className="difficulty-bar">
                                        <div className="easy-bar" style={{ width: `${easyPct}%` }}></div>
                                        <div className="medium-bar" style={{ width: `${mediumPct}%` }}></div>
                                        <div className="hard-bar" style={{ width: `${hardPct}%` }}></div>
                                    </div>
                                    <div className="difficulty-stats">
                                        <div className="difficulty-stat easy">
                                            <span className="dot"></span>
                                            <span>{companyData.easy} Easy</span>
                                        </div>
                                        <div className="difficulty-stat medium">
                                            <span className="dot"></span>
                                            <span>{companyData.medium} Medium</span>
                                        </div>
                                        <div className="difficulty-stat hard">
                                            <span className="dot"></span>
                                            <span>{companyData.hard} Hard</span>
                                        </div>
                                    </div>
                                    <div className="company-solved">
                                        <div className="company-solved-bar">
                                            <div className="company-solved-fill" style={{ width: `${solvedPct}%` }}></div>
                                        </div>
                                        <span className="company-solved-text">{solved}/{total}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
