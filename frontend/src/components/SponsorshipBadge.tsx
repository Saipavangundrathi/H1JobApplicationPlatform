import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

type CompanyStats = {
  h1bFiled?: number;
  approvalRate?: number;
};

type SponsorshipBadgeProps = {
  companyName: string;
};

export default function SponsorshipBadge({ companyName }: SponsorshipBadgeProps) {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyName) {
      setIsLoading(false);
      setStats(null);
      return;
    }

    const controller = new AbortController();

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/companies/stats?name=${encodeURIComponent(companyName)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          setStats(null);
          return;
        }

        const data = (await response.json()) as CompanyStats | null;
        if (!data) {
          setStats(null);
          return;
        }

        const hasValue =
          typeof data.h1bFiled === 'number' || typeof data.approvalRate === 'number';
        setStats(hasValue ? data : null);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setStats(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    return () => controller.abort();
  }, [companyName]);

  if (isLoading) {
    return (
      <div className="mt-3 w-full max-w-md animate-pulse rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-40 rounded-full bg-slate-200" />
            <div className="h-3 w-28 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const isHighApproval = (stats.approvalRate ?? 0) > 95;

  return (
    <div className="mt-3 w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/70 text-slate-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {stats.h1bFiled ?? 0}+ total visas sponsored in 2024
          </p>
          <p className="text-sm text-slate-500">
            <span className={isHighApproval ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-600'}>
              Verified Sponsor
            </span>{' '}
            • {stats.approvalRate ?? 0}% Approval Rate
          </p>
        </div>
      </div>
    </div>
  );
}
