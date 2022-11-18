CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    completed_tasks INTEGER DEFAULT 0,
    avatar TEXT
);

CREATE TABLE tasks (
    task_id INTEGER,
    username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (task_id, username)
);

CREATE TABLE badges (
    badge_id SERIAL PRIMARY KEY,
    unlock_num INTEGER NOT NULL,
    message TEXT NOT NULL
);

CREATE TABLE collected_badges (
    id SERIAL PRIMARY KEY,
    badge_id INTEGER
        REFERENCES badges ON DELETE CASCADE,
    username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE
);