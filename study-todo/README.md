# Study Todo — Flask 기반 스터디 일정/To‑Do 애플리케이션

이 저장소는 "아침 9시부터 저녁 6시까지(09:00–18:00)" 풀타임 강의 일정에 맞춘 개인 스터디용 Todo 웹 애플리케이션입니다. 간단하고 가벼운 Flask 서버와 정적 프론트엔드를 제공하며, 내부 SQLite 데이터베이스로 로컬에서 바로 실행해 사용할 수 있도록 설계되었습니다.

주요 기능
- REST API (CRUD): /api/todos
- 간단한 정적 SPA 프론트엔드 (HTML/Vanilla JS) — 할 일 추가, 완료 토글, 삭제
- 시간 기반 필터링: 강의 시간(09:00–18:00)과 그 외 항목 필터링
- DB 자동 초기화: 프로젝트 폴더에 todos.db 파일 생성

시스템 요구사항
- Python 3.10+ 권장
- 가상환경(venv) 사용 권장

설치 및 실행 (Windows PowerShell 예시)
1. 가상환경 생성 및 활성화 (이미 .venv가 있다면 활성화만):
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

2. 의존성 설치:
   pip install -r study-todo\requirements.txt

3. 애플리케이션 실행:
   python study-todo\app.py

4. 브라우저 접속:
   http://127.0.0.1:5000

디렉터리 구조
- study-todo/
  - app.py           — Flask 애플리케이션 진입점 및 API 구현
  - requirements.txt — 의존 패키지 목록 (Flask)
  - todos.db         — 실행 시 자동 생성되는 SQLite DB (gitignore에 등록)
  - templates/       — 서버가 렌더링하는 HTML (index.html)
  - static/
    - js/app.js       — 프론트엔드 로직 (fetch + 렌더링)
    - css/styles.css  — 기본 스타일
  - .gitignore       — 불필요 파일 제외 규칙

API 명세 (간단)
- GET /api/todos
  응답: 모든 Todo 목록(JSON 배열)
- POST /api/todos
  요청 JSON: { "title": "할 일", "time": "HH:MM" }
  응답: 생성된 Todo(201)
- PATCH /api/todos/:id
  요청 JSON: { "done": true } 또는 { "title": "새 제목", "time": "HH:MM" }
  응답: 업데이트된 Todo
- DELETE /api/todos/:id
  응답: 204 No Content

보안, 운영 및 확장 팁
- 현재 설정은 개발용(Flask debug=True). 프로덕션 배포 시 Gunicorn/uWSGI + 리버스 프록시(Nginx) 사용 권장.
- 데이터베이스를 SQLite에서 PostgreSQL로 전환하면 동시성 및 확장성 개선.
- 인증이 필요하면 Flask-Login 또는 JWT 기반 인증 추가 권장.
- CORS가 필요한 경우 flask-cors 추가 후 설정.

개발자 노트
- app.py는 일부 Flask 버전에서 before_first_request 데코레이터가 없을 수 있어, 모듈 임포트 시 DB를 초기화하도록 구현되어 있습니다.
- todos.db는 로컬 파일로 저장되며 .gitignore에 포함되어 있습니다.

문제가 발생하면
- Flask 버전 확인: pip show Flask
- 실행 로그를 첨부하여 이슈를 알려주시면 원인 분석 및 수정 도와드리겠습니다.

라이선스
- 개인/학습용 템플릿입니다. 필요 시 라이선스 텍스트 추가 가능.
