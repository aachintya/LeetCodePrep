import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthModal({ onClose }) {
    const { login, signup } = useApp();
    const [tab, setTab] = useState('login');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            if (tab === 'login') {
                login(formData.email, formData.password);
            } else {
                signup(formData.name, formData.email, formData.password);
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => setTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`modal-tab ${tab === 'signup' ? 'active' : ''}`}
                        onClick={() => setTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {tab === 'signup' && (
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                        />
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="submit-btn">
                        {tab === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-note">Progress is saved locally in your browser</p>
            </div>
        </div>
    );
}
