# Study Todo — 풀타임 강의용 스터디 플래너

작성자: 신민철 (Hayden Shin)

한줄 소개

Study Todo는 "아침 09:00 — 저녁 18:00" 풀타임 강의 일정에 맞춰 개인 스터디와 복습을 효율적으로 관리하도록 설계된 경량 웹 애플리케이션입니다. 로컬 SQLite에 데이터를 저장하는 간단한 Flask 백엔드와, 반응형 정적 프론트엔드를 포함합니다.

핵심 목표

- 강의 시간이 차지하는 하루 일정(09:00–18:00)을 고려한 작업 분류 및 필터링
- 즉시 실행 가능한 로컬 개발 환경(venv) 제공
- 최소한의 구성으로 신뢰 가능한 CRUD API 제공
- 확장·배포가 쉬운 구조(Flask + 정적 리소스)

디렉터리 개요

- study-todo/
  - app.py           — Flask 애플리케이션 진입점 및 REST API
  - requirements.txt — Python 의존성 (Flask)
  - todos.db         — 실행 시 생성되는 SQLite DB (gitignored)
  - templates/       — 서버 렌더링 HTML (index.html)
  - static/
    - js/app.js       — 프론트엔드 로직 (fetch 기반 SPA 동작)
    - css/styles.css  — 스타일(반응형, 카드 레이아웃)
  - .gitignore       — venv 및 DB 제외 규칙

설치 및 빠른 시작 (권장: 가상환경 사용)

Windows PowerShell 예시:

1) 가상환경 생성 및 활성화
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

2) 의존성 설치
   pip install -r study-todo\requirements.txt

3) 앱 실행
   python study-todo\app.py

4) 브라우저 열기
   http://127.0.0.1:5000

API 상세

- GET  /api/todos
  - 반환: 모든 Todo 배열
- POST /api/todos
  - 요청 JSON: { "title": "문구", "time": "HH:MM" }
  - 응답: 생성된 Todo (201)
- PATCH /api/todos/:id
  - 요청 JSON: { "done": true } 또는 { "title": "문구", "time": "HH:MM" }
  - 응답: 업데이트된 Todo
- DELETE /api/todos/:id
  - 응답: 204 No Content

데이터 모델 (SQLite)

CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  time TEXT,         -- HH:MM 포맷 권장, NULL 허용
  done INTEGER DEFAULT 0
);

운영·배포 권장 사항

- 개발 환경: 현재 구성은 개발용(development)입니다. debug 모드와 Flask 내장 서버는 프로덕션에 적합하지 않습니다.
- 권장 스택: Gunicorn/uWSGI + Nginx 리버스 프록시, PostgreSQL로 DB 마이그레이션
- 보안: 공개 배포 시 CORS 정책, 입력 검증, 인증(Flask-Login 또는 JWT) 추가 권장
- 로깅/모니터링: Sentry 또는 Prometheus 연동 고려

확장 아이디어

- 사용자 계정 및 동기화 기능 (계정별 DB → 중앙 DB)
- 모바일 앱 또는 PWA(오프라인 지원, 푸시 알림)
- 반복/스케줄링 기능 (매일/주간 템플릿)
- 우선순위/태그 기반 필터링 및 통계 대시보드

기여 가이드

- 간단한 변경: feature 브랜치 생성 → PR 요청
- 커밋 메시지: Conventional Commits 스타일 권장 (예: feat, fix, docs, style, chore)
- 데이터베이스 마이그레이션: SQLite에서 다른 DB로 전환하면 마이그레이션 스크립트를 포함할 것

문제 보고 및 연락

- 이 저장소에 Issue를 남겨 주세요. 긴급한 기술 지원 또는 커스터마이징 요청은 이메일/DM으로 연락 바랍니다.

저자 정보

신민철 (Hayden Shin)
- GitHub: https://github.com/Hayden-Shin-Dev
- 역할: 프로젝트 설계, 백엔드·프론트엔드 구현

라이선스

- 기본: 개인/학습용 템플릿입니다. 공개 배포 및 상업적 사용 시 라이선스 명시 필요 — 원하시면 LICENSE 파일 추가해 드립니다.

변경 기록 (간략)

- 초기: Vite/React 템플릿 생성 후, Flask 기반 앱으로 전환
- 기능: REST API, 정적 SPA 프론트엔드, UI 리디자인, DB 초기화 호환성 수정

---

README 업데이트: 루트에 위치해 프로젝트 메인 페이지(리포지토리 홈)에 전문적으로 표시됩니다.
