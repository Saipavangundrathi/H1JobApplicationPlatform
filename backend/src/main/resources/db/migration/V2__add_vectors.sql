-- =============================================================
-- V2: Enable pgvector and add embedding columns for RAG
-- Requires: pgvector/pgvector:pg16 Docker image
-- =============================================================

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add vector column to Users (profile/resume embedding)
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Add vector column to Jobs (job description embedding)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 4. Create HNSW index on jobs for fast cosine similarity search
CREATE INDEX IF NOT EXISTS jobs_embedding_hnsw_idx
    ON jobs USING hnsw (embedding vector_cosine_ops);
