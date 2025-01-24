ALTER TABLE IF EXISTS public."submission-log" ADD COLUMN is_external_file boolean DEFAULT False;

ALTER TABLE IF EXISTS public."lesson" ADD COLUMN category character varying;