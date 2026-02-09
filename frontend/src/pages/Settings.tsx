import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ProfileForm = {
  firstname: string;
  lastname: string;
  email: string;
};

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileForm>({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [profileStatus, setProfileStatus] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityStatus, setSecurityStatus] = useState('');

  const [isDeactivateEnabled, setIsDeactivateEnabled] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const loadProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token ?? ''}`,
          },
        });

        if (!response.ok) return;

        const data = (await response.json()) as ProfileForm;
        setProfile({
          firstname: data.firstname ?? '',
          lastname: data.lastname ?? '',
          email: data.email ?? '',
        });
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Profile update failed.');
      }

      setProfileStatus('Profile updated successfully.');
    } catch (error) {
      setProfileStatus(error instanceof Error ? error.message : 'Profile update failed.');
    }
  };

  const handleSecuritySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSecurityError('');
    setSecurityStatus('');

    if (newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Password update failed.');
      }

      setSecurityStatus('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setSecurityError(error instanceof Error ? error.message : 'Password update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Account deletion failed.');
      }

      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Account deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/30">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account preferences and security.</p>
      </div>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile Management</h2>
        <p className="mt-1 text-sm text-slate-500">Update your personal information.</p>

        <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="settings-firstname">
                First Name
              </label>
              <input
                id="settings-firstname"
                type="text"
                value={profile.firstname}
                onChange={(event) => setProfile((prev) => ({ ...prev, firstname: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="settings-lastname">
                Last Name
              </label>
              <input
                id="settings-lastname"
                type="text"
                value={profile.lastname}
                onChange={(event) => setProfile((prev) => ({ ...prev, lastname: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="settings-email">
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {profileStatus && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {profileStatus}
            </div>
          )}

          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
          >
            Save Changes
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        <p className="mt-1 text-sm text-slate-500">Change your password regularly to stay secure.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSecuritySubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="current-password">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
          </div>

          {securityError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {securityError}
            </div>
          )}
          {securityStatus && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {securityStatus}
            </div>
          )}

          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
          >
            Update Password
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50/40 p-8">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-500">
          Deactivate or delete your account. These actions are hard to undo.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-red-200/70 bg-white p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Deactivate Account</p>
              <p className="text-xs text-slate-500">Hide your profile and stop recommendations.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeactivateEnabled((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full transition ${
                isDeactivateEnabled ? 'bg-red-500' : 'bg-slate-200'
              }`}
              aria-pressed={isDeactivateEnabled}
            >
              <span
                className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition ${
                  isDeactivateEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200/70 bg-white p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Delete Account</p>
              <p className="text-xs text-slate-500">This will permanently erase your data.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Log Out</p>
              <p className="text-xs text-slate-500">Sign out from your current session.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-600"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Are you sure?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This action will permanently delete your account and cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
