import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VISA_OPTIONS = ['F1-OPT', 'H1B', 'STEM OPT', 'CPT', 'Other'] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [visaStatus, setVisaStatus] = useState(VISA_OPTIONS[0]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      targetRole,
      experience: Number(experience),
      visaStatus,
    };

    localStorage.setItem('onboarding', JSON.stringify(payload));
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tell us your goals</h1>
        <p className="mt-2 text-sm text-slate-500">
          We&apos;ll use this to tailor your job recommendations.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="target-role">
              Target Job Title
            </label>
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="experience">
              Years of Experience
            </label>
            <input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="visa-status">
              Visa Status
            </label>
            <select
              id="visa-status"
              value={visaStatus}
              onChange={(event) => setVisaStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {VISA_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
