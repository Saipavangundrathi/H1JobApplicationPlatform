import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

// 1. Define the Job shape
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  sponsorshipStatus: string;
  description: string;
}

const JobSearch = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // 2. Fetch from Backend
  useEffect(() => {
    fetch('http://localhost:8080/api/jobs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => {
        console.log("Jobs loaded:", data);
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load jobs. Is the Backend running?');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center text-slate-500 shadow-sm">Loading jobs from database...</div>;
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>;

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase().trim();
    const locationQuery = locationFilter.toLowerCase().trim();

    const matchesKeyword =
      !query ||
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query);

    const matchesLocation =
      !locationQuery || job.location?.toLowerCase().includes(locationQuery);

    return matchesKeyword && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Latest Job Postings</h1>
        <p className="mt-2 text-sm text-slate-500">Fresh roles with verified sponsorship status.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by job title, company, or keywords..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              placeholder="City or State..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No jobs found in the database. (Try adding one via Postman!)
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No jobs found matching your search.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-slate-600 font-medium">{job.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                  ${job.sponsorshipStatus === 'H1B_READY' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {job.sponsorshipStatus.replace('_', ' ')}
                </span>
              </div>
              
              <div className="mt-4 flex gap-4 text-sm text-slate-500">
                <span>📍 {job.location}</span>
              </div>
              
              <p className="mt-3 text-slate-600 line-clamp-2">{job.description}</p>
              
              <Link 
  to={`/jobs/${job.id}`} 
  className="mt-4 block w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700"
>
  View Details
</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobSearch;