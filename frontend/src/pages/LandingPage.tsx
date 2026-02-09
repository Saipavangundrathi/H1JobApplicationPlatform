import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: 'Verified Sponsorship Data',
    description: 'Know which companies truly sponsor before you apply.',
  },
  {
    title: 'AI Resume Tailoring',
    description: 'Optimize your resume against each job description instantly.',
  },
  {
    title: 'Smart Matching',
    description: 'Get role recommendations aligned with your skills and visa status.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">H1B Platform</p>
            <h1 className="text-lg font-semibold text-slate-900">SponsorScope</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link to="/login" className="hover:text-emerald-600">
              Sign in
            </Link>
            <Link
              to="/onboarding"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-emerald-100/40">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Built for students</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">
                Land Your Dream Job with H1B Sponsorship
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Discover verified sponsorship-ready roles, tailor your resume with AI, and focus only on
                companies that support international talent.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/onboarding"
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-slate-200/80 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-600 hover:text-emerald-600"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-emerald-100/60">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Weekly Sponsorship Insights</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Stay ahead with verified data</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Track sponsor activity and prioritize high-intent employers.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <p className="text-xs font-semibold text-emerald-600">AI Resume Match</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Boost ATS scores</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Tailor your resume in minutes with smart keyword guidance.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-500">Personalized Recommendations</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Find roles faster</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Focus on roles aligned with your skills and visa timeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-slate-900">Everything you need to get hired</h3>
              <p className="mt-2 text-sm text-slate-500">
                A focused platform for sponsorship-ready opportunities.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-emerald-100/50"
                >
                  <h4 className="text-lg font-semibold text-slate-900">{feature.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SponsorScope. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-emerald-600">
              Contact
            </Link>
            <Link to="/signup" className="hover:text-emerald-600">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
