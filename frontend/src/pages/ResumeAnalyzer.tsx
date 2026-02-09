import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FEEDBACK_ITEMS = [
  "Missing 'Java' keyword in work history",
  'Formatting issues detected in Education section',
  'Add more quantified impact (numbers) in bullet points',
];

const ANALYSIS_STEPS = [
  'Fetching resume from secure vault...',
  'Scanning for keywords...',
  'Comparing against H1B job requirements...',
  'Calculating ATS score...',
];

export default function ResumeAnalyzer() {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (resumeId) {
      startAnalysis(resumeId);
    }
  }, [resumeId]);

  const startAnalysis = (id: string) => {
    setIsAnalyzing(true);
    setShowResult(false);
    setFileName(`Resume #${id}`);

    let currentStep = 0;
    const interval = window.setInterval(() => {
      currentStep += 1;
      setStepIndex(currentStep);

      if (currentStep >= ANALYSIS_STEPS.length) {
        window.clearInterval(interval);
        setIsAnalyzing(false);
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {resumeId && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <h2 className="text-xl font-bold text-emerald-900">Analyzing Selected Resume</h2>
          <p className="text-emerald-600">ID: {resumeId}</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mb-4 text-4xl animate-spin">⚙️</div>
          <h2 className="text-2xl font-bold text-slate-800">
            {ANALYSIS_STEPS[stepIndex] || 'Finalizing...'}
          </h2>
          <div className="mx-auto mt-4 h-2 w-64 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {showResult && (
        <div className="grid gap-6 md:grid-cols-[1fr_2fr] animate-fade-in-up">
          <div className="flex items-center justify-center rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg">
            <div className="flex flex-col items-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-8 border-emerald-500 text-3xl font-bold text-slate-800 shadow-inner">
                78/100
              </div>
              <span className="mt-4 font-semibold text-emerald-600">H1B Ready</span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Improvement Suggestions</h2>
            <ul className="space-y-3">
              {FEEDBACK_ITEMS.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm text-orange-800"
                >
                  <span>⚠️</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!resumeId && !isAnalyzing && !showResult && (
        <div className="p-12 text-center text-gray-500">
          Please select a resume from &quot;My Resumes&quot; to analyze.
        </div>
      )}
    </div>
  );
}
