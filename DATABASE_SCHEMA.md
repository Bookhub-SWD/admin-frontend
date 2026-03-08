# Database Schema Reference

> [!IMPORTANT]
> This document is for context and AI reference only. It describes the backend database structure to help with frontend development and API integration.

## Tables

### `public.profiles`
User profiles linked to Auth.
- `id` (uuid): Primary Key, references `auth.users(id)`
- `name` (text)
- `email` (text)
- `created_at` (timestamp with time zone)

### `public.topics`
Content topics for assessments.
- `id` (bigint): Primary Key, IDENTITY
- `name` (text): Unique
- `description` (text)
- `created_at` (timestamp with time zone)

### `public.question_groups`
Groups of questions for a specific topic.
- `id` (bigint): Primary Key, IDENTITY
- `title` (text): Unique
- `description` (text)
- `topic_id` (bigint): References `public.topics(id)`

### `public.questions`
Individual assessment questions.
- `id` (bigint): Primary Key, IDENTITY
- `content` (text)
- `answer_nums` (smallint)
- `options` (json)
- `parent_question_id` (bigint)
- `question_group_id` (bigint): References `public.question_groups(id)`
- `type_answer` (character varying)
- `key_word` (text)

### `public.assessments`
User assessment records.
- `id` (bigint): Primary Key, IDENTITY
- `user_id` (uuid): References `public.profiles(id)`
- `topic_id` (bigint): References `public.topics(id)`
- `answer_json` (jsonb)
- `is_completed` (boolean)
- `create_at` (timestamp without time zone)

### `public.assessment_results`
Results generated from assessments.
- `id` (bigint): Primary Key, IDENTITY
- `assessment_id` (bigint): References `public.assessments(id)`
- `result_jsonb` (jsonb)
- `created_at` (timestamp with time zone)

### `public.jars`
Financial tracking jars (buckets).
- `id` (bigint): Primary Key, IDENTITY
- `user_id` (uuid): References `public.profiles(id)`
- `code` (text)
- `title` (text)
- `percent` (bigint)
- `max_amount` (bigint)
- `current_amount` (bigint)
- `updated_at` (timestamp with time zone)

### `public.transactions`
Financial transactions linked to jars.
- `id` (bigint): Primary Key, IDENTITY
- `user_id` (uuid): References `public.profiles(id)`
- `jar_id` (bigint): References `public.jars(id)`
- `description` (text)
- `amount` (bigint)
- `direction` (text)
- `updated_at` (timestamp with time zone)
