import os
from datetime import datetime
from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError

# Импортируем нашу базу
from db import get_db

# Создаем MCP сервер (в v2 FastMCP переименован в MCPServer)
mcp = MCPServer("HR-Leaves")

# --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

def parse_date(date_str: str) -> datetime:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise ToolError(f"Дата должна быть в формате YYYY-MM-DD, получено: {date_str}")

# --- ИНСТРУМЕНТЫ (TOOLS) ---

@mcp.tool()
def list_leave_requests(department: str = None, status: str = None) -> str:
    """Возвращает список заявок на отпуск в виде текста."""
    query = """
        SELECT r.id, e.full_name, d.name as dept, r.date_start, r.date_end, r.status
        FROM leave_requests r
        JOIN employees e ON r.employee_id = e.id
        JOIN departments d ON e.department_id = d.id
        WHERE 1=1
    """
    params = []
    if department:
        query += " AND d.name = ?"
        params.append(department)
    if status:
        query += " AND r.status = ?"
        params.append(status)
        
    with get_db() as conn:
        rows = conn.execute(query, params).fetchall()
        
    if not rows:
        return "Заявок не найдено."
        
    result = ["Список заявок:"]
    for r in rows:
        result.append(f"№{r['id']} | {r['full_name']} ({r['dept']}) | {r['date_start']} по {r['date_end']} | Статус: {r['status']}")
    return "\n".join(result)

@mcp.tool()
def get_leave_balance(employee_name: str, year: int) -> str:
    """Возвращает остаток дней отпуска для сотрудника."""
    with get_db() as conn:
        row = conn.execute("""
            SELECT e.full_name, b.entitled_days, b.used_days, b.planned_days
            FROM leave_balances b
            JOIN employees e ON b.employee_id = e.id
            WHERE e.full_name LIKE ? AND b.year = ?
        """, (f"%{employee_name}%", year)).fetchone()
        
    if not row:
        raise ToolError(f"Сотрудник '{employee_name}' или данные на {year} год не найдены.")
        
    left = row['entitled_days'] - row['used_days'] - row['planned_days']
    return f"Сотрудник: {row['full_name']}. Остаток на {year} год: {left} дн. (Положено: {row['entitled_days']}, Использовано: {row['used_days']}, В планах: {row['planned_days']})"

@mcp.tool()
def submit_leave_request(employee_name: str, date_start: str, date_end: str) -> str:
    """Создает черновик заявки на отпуск."""
    start = parse_date(date_start)
    end = parse_date(date_end)
    if end < start:
        raise ToolError(f"Дата окончания ({date_end}) раньше даты начала ({date_start}).")
        
    days = (end - start).days + 1
    
    with get_db() as conn:
        emp = conn.execute("SELECT id FROM employees WHERE full_name LIKE ?", (f"%{employee_name}%",)).fetchone()
        if not emp:
            raise ToolError(f"Сотрудник '{employee_name}' не найден.")
            
        conn.execute("""
            INSERT INTO leave_requests (employee_id, leave_type_id, date_start, date_end, days_count, status)
            VALUES (?, 1, ?, ?, ?, 'pending')
        """, (emp['id'], date_start, date_end, days))
        conn.commit()
        
    return f"Заявка для {employee_name} на {days} дн. ({date_start} по {date_end}) создана и ожидает согласования."

@mcp.tool()
def cancel_leave_request(request_id: int) -> str:
    """Отменяет заявку на отпуск (необратимое действие)."""
    with get_db() as conn:
        req = conn.execute("SELECT status FROM leave_requests WHERE id = ?", (request_id,)).fetchone()
        if not req:
            raise ToolError(f"Заявка №{request_id} не найдена.")
        if req['status'] == 'cancelled':
            raise ToolError(f"Заявка №{request_id} уже отменена.")
            
        conn.execute("UPDATE leave_requests SET status = 'cancelled' WHERE id = ?", (request_id,))
        conn.commit()
    return f"Заявка №{request_id} успешно отменена."

# --- РЕСУРСЫ (RESOURCES) ---

@mcp.resource("leaves://requests")
def get_requests_resource() -> str:
    """Возвращает список всех заявок (для панели)."""
    with get_db() as conn:
        rows = conn.execute("""
            SELECT r.id, e.full_name, r.date_start, r.date_end, r.status
            FROM leave_requests r JOIN employees e ON r.employee_id = e.id
        """).fetchall()
    return "\n".join([f"#{r['id']} - {r['full_name']} ({r['status']})" for r in rows])

@mcp.resource("leaves://reference")
def get_reference_resource() -> str:
    """Возвращает справочник отделов и категорий."""
    with get_db() as conn:
        deps = conn.execute("SELECT name FROM departments").fetchall()
        cats = conn.execute("SELECT name, priority FROM categories").fetchall()
    dep_str = ", ".join([d['name'] for d in deps])
    cat_str = ", ".join([f"{c['name']} (приоритет {c['priority']})" for c in cats])
    return f"Отделы: {dep_str}\nКатегории: {cat_str}"

# --- ЗАПУСК ---

if __name__ == "__main__":
    # Запускаем сервер через SSE (по умолчанию порт 8000)
    mcp.run(transport="sse")