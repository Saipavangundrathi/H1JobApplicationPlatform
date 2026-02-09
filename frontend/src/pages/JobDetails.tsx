import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SponsorshipBadge from '../components/SponsorshipBadge';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  sponsorshipStatus: string;
  description: string;
  postedAt: string;
  sourceUrl?: string;
}

const JobDetails = () => {
  const { id } = useParams(); // Catch the "4" from /jobs/4
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordError, setKeywordError] = useState('');
  const [keywordResult, setKeywordResult] = useState<{ score: number; keywords: string[] } | null>(
    null
  );

  useEffect(() => {
    fetch(`http://localhost:8080/api/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Job not found');
        return res.json();
      })
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center text-slate-500 shadow-sm">Loading details...</div>;
  if (error || !job) return <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-600">Error: {error}</div>;

  const hasSourceUrl = Boolean(job.sourceUrl);
  const handleKeywordSuggestions = async () => {
    setKeywordError('');
    setKeywordResult(null);
    setKeywordLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to get ATS keyword suggestions.');
      }
      const response = await fetch('http://localhost:8080/api/ai/keyword-suggestions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription: job.description }),
      });

      if (!response.ok) {
        let message = 'Failed to fetch ATS keyword suggestions.';
        try {
          const text = await response.text();
          if (text) {
            message = text;
          }
        } catch {
          // Ignore parse errors, keep default message.
        }
        throw new Error(message);
      }

      const data = (await response.json()) as { score?: number; keywords?: string[] };
      setKeywordResult({
        score: typeof data.score === 'number' ? data.score : 72,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
      });
    } catch (err) {
      setKeywordError(err instanceof Error ? err.message : 'Failed to fetch ATS keyword suggestions.');
    } finally {
      setKeywordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Link to="/dashboard" className="text-emerald-600 font-medium hover:underline">
        ← Back to Jobs
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-lg shadow-emerald-100/40">
        {/* Header */}
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-emerald-50 p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="mb-2 text-3xl font-semibold text-slate-900">{job.title}</h1>
              <div className="flex items-center gap-4 text-slate-600">
                <span className="text-lg font-semibold">{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
              <SponsorshipBadge companyName={job.company} />
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold 
              ${job.sponsorshipStatus === 'H1B_READY' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {job.sponsorshipStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Job Description</h3>
          <p className="whitespace-pre-line leading-relaxed text-slate-600">
            {job.description}
          </p>
          
          <div className="mt-8 border-t border-slate-200/70 pt-8 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleKeywordSuggestions}
                disabled={keywordLoading}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-6 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {keywordLoading ? 'Analyzing ATS match...' : 'Get ATS Keyword Suggestions'}
              </button>

              <button
                onClick={() => job.sourceUrl && window.open(job.sourceUrl, '_blank')}
                disabled={!hasSourceUrl}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              >
                {hasSourceUrl ? 'Apply on Company Site' : 'Application Closed'}
              </button>
            </div>

            {keywordError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {keywordError}
              </div>
            )}

            {keywordResult && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-indigo-900">ATS Keyword Suggestions</h4>
                  <span className="rounded-full bg-indigo-200/70 px-3 py-1 text-xs font-semibold text-indigo-900">
                    Score: {keywordResult.score}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {keywordResult.keywords.length === 0 ? (
                    <span className="text-sm text-indigo-700">No suggestions found.</span>
                  ) : (
                    keywordResult.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;