const LECTURE_START = 9, LECTURE_END = 18

function isLectureHour(timeStr){
  if(!timeStr) return false
  const h = Number(timeStr.split(':')[0])
  return h >= LECTURE_START && h < LECTURE_END
}

async function fetchTodos(){
  const res = await fetch('/api/todos')
  return await res.json()
}

function el(sel){ return document.querySelector(sel) }

function renderList(items, filter){
  const ul = el('#list')
  ul.innerHTML = ''
  const filtered = items.filter(t => {
    if(filter==='lecture') return isLectureHour(t.time)
    if(filter==='outside') return t.time? !isLectureHour(t.time) : true
    return true
  })
  if(filtered.length===0){ ul.innerHTML = '<li class="empty">할 일이 없습니다.</li>'; return }
  for(const t of filtered){
    const li = document.createElement('li')
    li.className = t.done? 'done':''
    li.innerHTML = `
      <div class="left">
        <input type="checkbox" data-id="${t.id}" ${t.done? 'checked':''} />
        <div>
          <div class="title">${escapeHtml(t.title)}</div>
          <div class="meta">${t.time? `<span class="badge ${isLectureHour(t.time)?'lecture':''}">${t.time}</span>`: ''}</div>
        </div>
      </div>
      <div class="right"><button data-del="${t.id}" class="del">삭제</button></div>
    `
    ul.appendChild(li)
  }
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

async function refresh(){
  const items = await fetchTodos()
  const active = document.querySelector('.filters button.active').dataset.filter
  renderList(items, active)
}

document.addEventListener('click', async (e)=>{
  if(e.target.matches('.filters button')){
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'))
    e.target.classList.add('active')
    await refresh()
  }
  if(e.target.matches('[data-del]')){
    const id = e.target.getAttribute('data-del')
    await fetch(`/api/todos/${id}`, {method:'DELETE'})
    await refresh()
  }
})

el('#addForm').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const title = el('#title').value.trim()
  const time = el('#time').value || null
  if(!title) return
  await fetch('/api/todos', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title,time})})
  el('#title').value=''
  el('#time').value=''
  await refresh()
})

el('#list').addEventListener('change', async (e)=>{
  if(e.target.matches('input[type=checkbox]')){
    const id = e.target.getAttribute('data-id')
    const done = e.target.checked
    await fetch(`/api/todos/${id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({done})})
    await refresh()
  }
})

window.addEventListener('DOMContentLoaded', refresh)
