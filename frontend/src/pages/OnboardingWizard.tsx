import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type WizardData = {
  firstname: string;
  lastname: string;
  city: string;
  targetRoles: string;
  yearsExperience: string;
  visaStatus: string;
  email: string;
  password: string;
};

const STEPS = ['Identity', 'Career Goals', 'Account'] as const;
const VISA_OPTIONS = ['F1-OPT', 'H1B', 'STEM OPT', 'CPT', 'Other'] as const;

const initialData: WizardData = {
  firstname: '',
  lastname: '',
  city: '',
  targetRoles: '',
  yearsExperience: '',
  visaStatus: VISA_OPTIONS[0],
  email: '',
  password: '',
};

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<WizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(() => ((stepIndex + 1) / STEPS.length) * 100, [stepIndex]);

  const updateField = (field: keyof WizardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError('');
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          city: formData.city,
          targetRoles: formData.targetRoles,
          yearsExperience: Number(formData.yearsExperience),
          visaStatus: formData.visaStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (data?.token) {
        localStorage.setItem('token', data.token);
      }

      localStorage.setItem(
        'user',
        JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
        })
      );

      navigate('/dashboard');
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/40">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Onboarding</p>
          <h1 className="text-2xl font-semibold text-slate-900">Let&apos;s personalize your search</h1>
          <p className="text-sm text-slate-500">
            Step {stepIndex + 1} of {STEPS.length} — {STEPS[stepIndex]}
          </p>
        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {stepIndex === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-firstname">
                  First Name
                </label>
                <input
                  id="wizard-firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={(event) => updateField('firstname', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-lastname">
                  Last Name
                </label>
                <input
                  id="wizard-lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={(event) => updateField('lastname', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-city">
                  Current City
                </label>
                <input
                  id="wizard-city"
                  type="text"
                  value={formData.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="e.g., San Francisco"
                  required
                />
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-target-roles">
                  Target Job Roles
                </label>
                <input
                  id="wizard-target-roles"
                  type="text"
                  value={formData.targetRoles}
                  onChange={(event) => updateField('targetRoles', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="e.g., Frontend Engineer, Product Engineer"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="wizard-experience">
                    Years of Experience
                  </label>
                  <input
                    id="wizard-experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience}
                    onChange={(event) => updateField('yearsExperience', event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="wizard-visa">
                    Visa Status
                  </label>
                  <select
                    id="wizard-visa"
                    value={formData.visaStatus}
                    onChange={(event) => updateField('visaStatus', event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {VISA_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-email">
                  Email
                </label>
                <input
                  id="wizard-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="wizard-password">
                  Password
                </label>
                <input
                  id="wizard-password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {stepIndex < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
