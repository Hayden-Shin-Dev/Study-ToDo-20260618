from flask import Flask, jsonify, request, render_template, g
import sqlite3, os

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, 'todos.db')

def get_db():
    db = getattr(g, '_db', None)
    if db is None:
        db = g._db = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
    return db

def init_db():
    if not os.path.exists(DB_PATH):
        db = sqlite3.connect(DB_PATH)
        db.execute('CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, time TEXT, done INTEGER DEFAULT 0)')
        db.commit()
        db.close()

app = Flask(__name__, static_folder='static', template_folder='templates')

# Initialize DB at import time (compatible with Flask versions lacking before_first_request)
init_db()

@app.teardown_appcontext
def close_db(exc):
    db = getattr(g, '_db', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/todos', methods=['GET','POST'])
def todos():
    db = get_db()
    if request.method == 'GET':
        rows = db.execute('SELECT * FROM todos ORDER BY id DESC').fetchall()
        return jsonify([dict(r) for r in rows])
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    time = data.get('time') or None
    if not title:
        return jsonify({'error':'title required'}), 400
    cur = db.execute('INSERT INTO todos (title,time,done) VALUES (?,?,0)', (title, time))
    db.commit()
    tid = cur.lastrowid
    row = db.execute('SELECT * FROM todos WHERE id=?', (tid,)).fetchone()
    return jsonify(dict(row)), 201

@app.route('/api/todos/<int:tid>', methods=['PATCH','DELETE'])
def todo_item(tid):
    db = get_db()
    if request.method == 'PATCH':
        data = request.get_json() or {}
        if 'done' in data:
            db.execute('UPDATE todos SET done=? WHERE id=?', (1 if data['done'] else 0, tid))
        else:
            db.execute('UPDATE todos SET title=?, time=? WHERE id=?', (data.get('title'), data.get('time'), tid))
        db.commit()
        row = db.execute('SELECT * FROM todos WHERE id=?', (tid,)).fetchone()
        if not row:
            return jsonify({'error':'not found'}), 404
        return jsonify(dict(row))
    else:
        db.execute('DELETE FROM todos WHERE id=?', (tid,))
        db.commit()
        return ('', 204)

if __name__ == '__main__':
    app.run(debug=True)
