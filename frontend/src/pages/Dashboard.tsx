import RecommendedJobs from '../components/RecommendedJobs';
import JobSearch from './JobSearch';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <RecommendedJobs />
      <JobSearch />
    </div>
  );
}
