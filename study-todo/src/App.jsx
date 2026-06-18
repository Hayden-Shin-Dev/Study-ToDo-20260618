import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'study-todo-items'
const LECTURE_START = 9
const LECTURE_END = 18

function isLectureHour(timeStr) {
  if (!timeStr) return false
  const [h] = timeStr.split(':').map(Number)
  return h >= LECTURE_START && h < LECTURE_END
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setTodos(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addTodo(e) {
    e.preventDefault()
    if (!title.trim()) return
    const item = {
      id: Date.now().toString(),
      title: title.trim(),
      time: time || null,
      done: false
    }
    setTodos(prev => [item, ...prev])
    setTitle('')
    setTime('')
  }

  function toggleDone(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function removeTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t => {
    if (filter === 'lecture') return isLectureHour(t.time)
    if (filter === 'outside') return t.time ? !isLectureHour(t.time) : true
    return true
  })

  return (
    <div className="app">
      <header>
        <h1>스터디 Todo (강의시간: 9:00–18:00)</h1>
        <p className="muted">아침 9시부터 저녁 6시까지 수업이 있을 때 쓰기 좋습니다.</p>
      </header>

      <form onSubmit={addTodo} className="add-form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="할 일 입력 (예: 복습 30분)" />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        <button type="submit">추가</button>
      </form>

      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter==='all'? 'active':''}>전체</button>
        <button onClick={() => setFilter('lecture')} className={filter==='lecture'? 'active':''}>강의시간</button>
        <button onClick={() => setFilter('outside')} className={filter==='outside'? 'active':''}>강의외</button>
      </div>

      <ul className="todo-list">
        {filtered.length === 0 && <li className="empty">할 일이 없습니다.</li>}
        {filtered.map(t => (
          <li key={t.id} className={t.done? 'done':''}>
            <div className="left">
              <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} />
              <div>
                <div className="title">{t.title}</div>
                <div className="meta">
                  {t.time && <span className={isLectureHour(t.time)? 'badge lecture':'badge'}>{t.time}</span>}
                </div>
              </div>
            </div>
            <div className="right">
              <button className="del" onClick={() => removeTodo(t.id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>

      <footer>
        <small>로컬에 저장됩니다. npm run dev로 실행하세요.</small>
      </footer>
    </div>
  )
}
