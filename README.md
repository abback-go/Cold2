# 🧊 한파 피하기 (Cold Wave Dodge)

한파를 테마로 한 가벼운 브라우저 피하기 게임. 단일 페이지, 키보드 조작.

## 플레이

- **← →**: 좌우 이동
- **Space**: 시작
- **R**: 재시작 (게임 오버 후)
- **🔥 모닥불**: 충돌 시 +5점 보너스 + 0.5초 슬로우모

## 개발

```bash
npm install
npm run dev          # 개발 서버 (http://localhost:5173)
npm test             # 단위 테스트 (Vitest)
npm run test:e2e     # E2E 테스트 (Playwright)
npm run build        # 프로덕션 빌드 (dist/)
npm run preview      # 빌드 결과 미리보기
```

## 게임 디자인

- **속도 곡선**: 200px/s → 매 10초 +50px/s → 상한 600px/s (80초 후)
- **스폰 간격**: `1500ms × (200 / 현재속도)` — 속도와 동기화 (밀도 일정)
- **솔버빌리티 보장**: 매 스폰 시 위쪽 1/3 영역에 항상 한 레인은 비어있음
- **레인**: 3개 고정 (좌/중/우)

## 구조

```
src/
├── speed.js        가속 곡선, 스폰 간격 계산 (pure)
├── collision.js    AABB 충돌 감지 (pure)
├── score.js        생존 시간 + 보너스 (pure)
├── obstacle.js     스폰 로직, 솔버빌리티 보장 (pure)
└── main.js         게임 루프, 상태 머신, Canvas 렌더링

tests/
├── unit/           Vitest 단위 테스트 (55개)
└── e2e/            Playwright E2E (5개)
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로:
1. 단위 테스트 실행
2. Vite 빌드
3. GitHub Pages 배포

배포 활성화: 저장소 Settings → Pages → Source = GitHub Actions
