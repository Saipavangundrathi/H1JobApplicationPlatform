import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type ProfileData = {
  firstname?: string;
  lastname?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

type JobSummary = {
  id: number;
  title: string;
  company: string;
};

type JobApplication = {
  id: number;
  job: JobSummary;
  status: string;
  appliedAt: string;
};

type SavedJob = {
  id: number;
  job: JobSummary;
  savedAt: string;
};

const getInitials = (value: string) => {
  const parts = value.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return `${first}${second}`.toUpperCase() || 'U';
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [activeTab, setActiveTab] = useState<'applied' | 'saved'>('applied');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProfile = fetch('http://localhost:8080/api/users/me', {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    });

    const fetchApplications = fetch('http://localhost:8080/api/user/applications', {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    });

    const fetchSavedJobs = fetch('http://localhost:8080/api/user/saved-jobs', {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    });

    const loadAll = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [profileResponse, applicationsResponse, savedJobsResponse] = await Promise.all([
          fetchProfile,
          fetchApplications,
          fetchSavedJobs,
        ]);

        if (!profileResponse.ok) {
          throw new Error('Unable to load profile.');
        }

        const profileData = (await profileResponse.json()) as ProfileData;
        setProfile(profileData);

        if (applicationsResponse.ok) {
          const applicationsData = (await applicationsResponse.json()) as JobApplication[];
          setApplications(applicationsData);
        }

        if (savedJobsResponse.ok) {
          const savedJobsData = (await savedJobsResponse.json()) as SavedJob[];
          setSavedJobs(savedJobsData);
        }
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : 'Something went wrong. Please try again.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, []);

  const fullName = useMemo(() => {
    if (!profile) {
      return '';
    }
    return (
      profile.fullName ||
      [profile.firstname, profile.lastname].filter(Boolean).join(' ') ||
      'User'
    );
  }, [profile]);

  const initials = useMemo(() => {
    if (fullName) {
      return getInitials(fullName);
    }
    return getInitials(profile?.email ?? 'User');
  }, [fullName, profile?.email]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/40">
        {isLoading ? (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-16 w-16 rounded-2xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-full bg-slate-200" />
              <div className="h-3 w-28 rounded-full bg-slate-200" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-xl font-semibold text-white shadow-lg shadow-emerald-200/60">
              {initials}
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">{fullName}</p>
              <p className="text-sm text-slate-500">{profile?.role ?? 'Candidate'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Jobs Applied</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{applications.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Jobs Saved</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{savedJobs.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-400">Resumes Optimized</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">0</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('applied')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'applied'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Applied Jobs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Saved Jobs
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {activeTab === 'applied' ? (
            applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No jobs yet. Go to{' '}
                <Link to="/dashboard" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Dashboard
                </Link>{' '}
                to search!
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{application.job.title}</p>
                      <p className="text-sm text-slate-500">{application.job.company}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Applied
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Date Applied: {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )
          ) : savedJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              No jobs yet. Go to{' '}
              <Link to="/dashboard" className="font-semibold text-emerald-600 hover:text-emerald-700">
                Dashboard
              </Link>{' '}
              to search!
            </div>
          ) : (
            savedJobs.map((saved) => (
              <div key={saved.id} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{saved.job.title}</p>
                    <p className="text-sm text-slate-500">{saved.job.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700">
                      Apply Now
                    </button>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:text-red-600">
                      Remove
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Saved on {new Date(saved.savedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
