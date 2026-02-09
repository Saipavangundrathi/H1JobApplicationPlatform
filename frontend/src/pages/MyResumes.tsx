import { useEffect, useState } from 'react';
import ResumeList from '../components/ResumeList';

type Resume = {
  id: number;
  fileName?: string;
  filename?: string;
  uploadedAt: string;
  isMaster?: boolean;
  master?: boolean;
};

type AnalysisResult = {
  score: number;
  strengths: string[];
  improvements: string[];
};

const getIsMaster = (resume: Resume) => resume.isMaster ?? resume.master ?? false;

export default function MyResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const loadResumes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/resumes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unable to load resumes.');
      }

      const data = (await response.json()) as Resume[];
      setResumes(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/resumes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed.');
      }

      await loadResumes();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetMaster = async (resumeId: number) => {
    const previous = resumes;
    setResumes((prev) =>
      prev.map((resume) => ({
        ...resume,
        isMaster: resume.id === resumeId,
        master: resume.id === resumeId,
      }))
    );

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/resumes/${resumeId}/master`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to set master resume.');
      }
    } catch (updateError) {
      setResumes(previous);
      setError(updateError instanceof Error ? updateError.message : 'Failed to set master resume.');
    }
  };

  const handleDelete = async (resumeId: number) => {
    const previous = resumes;
    setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume.');
      }
    } catch (deleteError) {
      setResumes(previous);
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete resume.');
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async (resumeId: number): Promise<AnalysisResult> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/ai/analyze-resume/${resumeId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Analysis failed.');
      }

      const data = await response.json();
      return {
        score: typeof data?.score === 'number' ? data.score : 78,
        strengths: Array.isArray(data?.strengths) ? data.strengths : [],
        improvements: Array.isArray(data?.improvements) ? data.improvements : [],
      };
    } catch (analysisError) {
      const message =
        analysisError instanceof Error ? analysisError.message : 'Analysis failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const resumeListItems = resumes.map((resume) => ({
    id: resume.id,
    fileName: resume.fileName ?? resume.filename ?? 'Untitled Resume',
    uploadedAt: resume.uploadedAt,
    isMaster: getIsMaster(resume),
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-emerald-100/30">
        <h1 className="text-2xl font-semibold text-slate-900">My Resumes</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your resume library and AI analysis.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <label
          htmlFor="resume-upload"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200/70 bg-slate-50/80 px-6 text-center text-sm text-slate-500 hover:border-emerald-500 hover:bg-emerald-50"
        >
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            {isUploading ? 'Uploading...' : 'Upload New Resume'}
          </div>
          <p>{isUploading ? 'Please wait while we upload your file.' : 'Drag & drop PDF or DOCX files here.'}</p>
          {isUploading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          )}
        </label>
      </section>

      <section>
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading resumes...
          </div>
        ) : (
          <ResumeList
            resumes={resumeListItems}
            onSetMaster={handleSetMaster}
            onDelete={handleDelete}
            onAnalyze={handleAnalyze}
          />
        )}
      </section>
    </div>
  );
}
