-- 1. Drop existing primary key
ALTER TABLE comments
DROP CONSTRAINT comments_pkey;

-- 2. Add new primary key on id
ALTER TABLE comments
ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
