import { useEffect, useMemo, useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

type RecommendedJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  matchScore?: number;
  similarityScore?: number;
  sourceUrl?: string;
};

const getMatchScore = (job: RecommendedJob) =>
  job.matchScore ?? job.similarityScore ?? 0;

const getBadgeClasses = (score: number) => {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700';
  if (score >= 70) return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:8080/api/jobs/recommendations', {
          headers: {
            Authorization: `Bearer ${token ?? ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Unable to load recommendations.');
        }

        const data = (await response.json()) as RecommendedJob[];
        setJobs(data);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : 'Unable to load recommendations.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="min-w-[260px] flex-1 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-32 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-24 rounded-full bg-slate-200" />
              <div className="mt-6 h-8 w-20 rounded-full bg-slate-200" />
              <div className="mt-4 h-9 w-full rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 text-sm text-slate-500">
          Upload a resume to get matched!
        </div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {jobs.map((job) => {
          const score = getMatchScore(job);
          return (
            <div
              key={job.id}
              className="min-w-[260px] flex-1 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.company}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getBadgeClasses(score)}`}>
                  {score}% Match
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{job.location}</span>
              </div>

              <button
                type="button"
                onClick={() => job.sourceUrl && window.open(job.sourceUrl, '_blank')}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700"
              >
                <Sparkles className="h-4 w-4" />
                Quick Apply
              </button>
            </div>
          );
        })}
      </div>
    );
  }, [error, isLoading, jobs]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Jobs Picked for You 🤖</h2>
        <span className="text-xs text-slate-400">AI matched</span>
      </div>
      {content}
    </section>
  );
}
