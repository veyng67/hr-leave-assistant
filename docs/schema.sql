-- Отделы
CREATE TABLE IF NOT EXISTS departments (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    name                  TEXT NOT NULL UNIQUE,
    max_concurrent_absent REAL NOT NULL DEFAULT 0.3
);

-- Категории сотрудников (правило очередности)
CREATE TABLE IF NOT EXISTS categories (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL UNIQUE,
    priority INTEGER NOT NULL
);

-- Сотрудники
CREATE TABLE IF NOT EXISTS employees (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name     TEXT NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    category_id   INTEGER NOT NULL REFERENCES categories(id),
    position      TEXT NOT NULL,
    hire_date     TEXT NOT NULL
);

-- Типы отпусков
CREATE TABLE IF NOT EXISTS leave_types (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Остатки дней по годам
CREATE TABLE IF NOT EXISTS leave_balances (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id   INTEGER NOT NULL REFERENCES employees(id),
    year          INTEGER NOT NULL,
    entitled_days INTEGER NOT NULL,
    used_days     INTEGER NOT NULL DEFAULT 0,
    planned_days  INTEGER NOT NULL DEFAULT 0,
    UNIQUE(employee_id, year)
);

-- Заявки на отпуск
CREATE TABLE IF NOT EXISTS leave_requests (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id   INTEGER NOT NULL REFERENCES employees(id),
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id),
    date_start    TEXT NOT NULL,
    date_end      TEXT NOT NULL,
    days_count    INTEGER NOT NULL,
    status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK(status IN ('draft','pending','approved','rejected','cancelled')),
    actual_start  TEXT,
    actual_end    TEXT,
    note          TEXT,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Годовой график отпусков
CREATE TABLE IF NOT EXISTS vacation_schedule (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    year          INTEGER NOT NULL,
    employee_id   INTEGER NOT NULL REFERENCES employees(id),
    planned_start TEXT NOT NULL,
    planned_end   TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'planned'
                  CHECK(status IN ('planned','approved','done')),
    UNIQUE(year, employee_id)
);