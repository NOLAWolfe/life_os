import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import './Page.css';

const ProfilePage = () => {
    const { user } = useUser();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!window.confirm('⚠️ WARNING: This will permanently delete your account and ALL associated data (Finance, Health, Work). This cannot be undone. Are you absolutely sure?')) {
            return;
        }
        
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/system/user/${user.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Account deleted. Redirecting...');
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Failed to delete account:', err);
            alert('Deletion failed. System error.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="page-container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    USER PROFILE
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your identity and system access.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Account Info */}
                <section style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px', 
                    padding: '24px' 
                }}>
                    <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid var(--border-border)', paddingBottom: '10px' }}>Identity</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>NAME</label>
                            <input type="text" defaultValue={user?.name} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>EMAIL</label>
                            <input type="email" defaultValue={user?.email} disabled style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', color: 'var(--text-secondary)' }} />
                        </div>
                    </div>
                </section>

                {/* Subscription / Role */}
                <section style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '16px', 
                    padding: '24px' 
                }}>
                    <h3 style={{ margin: '0 0 20px 0', borderBottom: '1px solid var(--border-border)', paddingBottom: '10px' }}>System Access</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0', fontWeight: 'bold' }}>Vantage {user?.role?.toUpperCase()}</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full access to all enterprise modules enabled.</p>
                        </div>
                        <button className="btn-secondary" style={{ padding: '8px 16px' }}>Manage Billing</button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section style={{ 
                    background: 'rgba(255, 0, 0, 0.05)', 
                    border: '1px solid rgba(255, 0, 0, 0.2)', 
                    borderRadius: '16px', 
                    padding: '24px',
                    marginTop: '20px'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>Danger Zone</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                        Permanently delete your account and all associated data. This action is irreversible.
                    </p>
                    <button 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        style={{ 
                            background: '#ff4444', 
                            color: 'white', 
                            border: 'none', 
                            padding: '12px 24px', 
                            borderRadius: '8px', 
                            fontWeight: 'bold', 
                            cursor: 'pointer' 
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
