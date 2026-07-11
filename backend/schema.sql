-- AI Resume Analyzer - MySQL Schema
-- Run this if you prefer manual setup instead of Flask auto-create

CREATE DATABASE IF NOT EXISTS resume_analyzer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE resume_analyzer;

CREATE TABLE IF NOT EXISTS resume_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  candidate_name VARCHAR(255),
  email VARCHAR(255),
  resume_text TEXT,
  skills JSON,
  weak_points JSON,
  interview_questions JSON,
  overall_score INT,
  summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);
