import React, { useState } from 'react';
import { FileText, Trash2, CheckCircle, Sparkles, AlertCircle, X, ShieldCheck, TrendingUp } from 'lucide-react';

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
}

interface Resume {
  id: number;
  fileName: string;
  uploadedAt: string;
  isMaster: boolean;
}

interface ResumeListProps {
  resumes: Resume[];
  onSetMaster: (id: number) => void;
  onDelete: (id: number) => void;
  onAnalyze: (id: number) => Promise<AnalysisResult>;
}

const ResumeList: React.FC<ResumeListProps> = ({ resumes, onSetMaster, onDelete, onAnalyze }) => {
  console.log("DEBUG: Resumes Data Received:", resumes);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  const masterResume = resumes.find((r) => r.isMaster) || resumes[0];
  const otherResumes = resumes.filter((r) => r.id !== masterResume?.id);

  const handleAnalyze = async (id: number) => {
    try {
      setAnalyzingId(id);
      const result = await onAnalyze(id);
      setAnalysisData(result);
      setShowModal(true);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {showModal && analysisData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> AI Resume Analysis
                </h3>
                <p className="text-indigo-100 text-sm mt-1">Based on H1B & ATS standards</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-500 bg-white shadow-sm mb-3">
                <span className="text-4xl font-bold text-slate-800">{analysisData.score}</span>
              </div>
              <p className="font-medium text-slate-600">ATS Compatibility Score</p>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {analysisData.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" /> Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {analysisData.improvements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Master Resume
        </h2>

        {masterResume ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {masterResume.fileName || 'Untitled Resume'}
                </h3>
                <p className="text-sm text-slate-500">
                  Uploaded on {new Date(masterResume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleAnalyze(masterResume.id)}
                disabled={analyzingId === masterResume.id}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-70"
              >
                {analyzingId === masterResume.id ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze with AI
                  </>
                )}
              </button>

              <button
                onClick={() => onDelete(masterResume.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Resume"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">No resume selected as Master.</p>
          </div>
        )}
      </div>

      {otherResumes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Resume History</h2>
          <div className="space-y-3">
            {otherResumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{resume.fileName}</p>
                    <p className="text-xs text-slate-500">
                      Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetMaster(resume.id)}
                    className="text-xs px-3 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md font-medium transition-colors"
                  >
                    Make Master
                  </button>
                  <button
                    onClick={() => onDelete(resume.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeList;
