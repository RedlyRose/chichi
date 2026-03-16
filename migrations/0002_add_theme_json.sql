-- Migration 0002_add_theme_json.sql
ALTER TABLE pages ADD COLUMN theme_json TEXT;
