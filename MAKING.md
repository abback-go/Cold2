# 한파 피하기 게임 제작기

> 한 사람과 AI가 처음부터 끝까지 대화하며 만든 브라우저 게임의 전 과정.
> 초보자가 처음부터 따라할 수 있도록 시간 순으로 정리했습니다.

**최종 결과물**: https://abback-go.github.io/Cold2/

---

## 📌 한눈에 보기

| 항목 | 내용 |
|------|------|
| **만든 것** | 한파 테마 브라우저 피하기 게임 (단일 페이지) |
| **소요 시간** | 약 2-3시간 |
| **사용한 AI 도구** | Claude Code + gstack 스킬 |
| **사용한 기술** | HTML5 Canvas, JavaScript (vanilla), Vite, Vitest, Playwright |
| **배포** | GitHub Pages + GitHub Actions 자동 배포 |
| **테스트** | 단위 55개 + E2E 5개 (모두 통과) |

---

## 🎯 시작하기 전에 알면 좋은 것

이 글에 나오는 도구들의 역할:

- **Claude Code**: AI 어시스턴트(Claude)와 대화하며 코드를 짤 수 있는 CLI 환경
- **gstack**: Claude Code 위에서 동작하는 "스킬" 모음. 슬래시 명령어(`/office-hours`, `/plan-eng-review` 등)로 호출
- **Vite**: 자바스크립트 프로젝트의 개발 서버 + 빌드 도구
- **Vitest**: 단위 테스트(작은 함수 하나하나 검증) 프레임워크
- **Playwright**: E2E 테스트(실제 브라우저 자동화) 프레임워크
- **GitHub Pages**: GitHub 저장소를 정적 웹사이트로 무료 호스팅

---

## 📖 1장: 시작 — "한파 게임 만들고 싶어"

**시작 한 줄:**
> "한파와 관련된 가볍고 간단하며 재미있는 게임을 만들려고해"

이게 전부였습니다. 구체적인 형태도, 기술 스택도, 사용자 그룹도 정해진 게 없었어요.

이 모호한 시작점에서 바로 코드를 짜기 시작하는 게 보통의 함정입니다. **"뭘 만들지 정확히 모르는데 만들기 시작하면 나중에 다 갈아엎기 일쑤"**라서요. 그래서 첫 단계는 **아이디어 다듬기**입니다.

---

## 📖 2장: 아이디어 다듬기 (`/office-hours`)

`/gstack-office-hours`를 호출했습니다. 이 스킬은 Y Combinator의 "오피스 아워" 스타일로, AI가 질문을 던져 아이디어를 구체화시킵니다.

### 2-1. 목적 확인

먼저 AI가 물었습니다:
> "이걸 만드는 목적이 뭐예요?"

선택지: 사이드 프로젝트 / 해커톤 데모 / 학습 / 스타트업 가능성

내 답변: **"해커톤/데모"**

→ 이 답에 따라 AI가 "Builder 모드"로 전환했습니다. 진지한 비즈니스가 아닌 "친구들에게 보여줄 데모"라는 맥락이 모든 결정의 기준이 됩니다.

### 2-2. 핵심 4질문 (한 번에 하나씩)

AI가 한 번에 한 질문씩 던지며 아이디어를 다듬었습니다:

| 질문 | 내 답 |
|------|-------|
| 가장 멋진 버전은 어떤 모습? | 단순한 피하기 게임 |
| 누구한테 보여줄까? | 학교 친구들 |
| 가장 빠른 시작 버전은? | 스코어 + 점점 빨라지는 한파 타이밍 줄 |
| 시간 무한정 있으면 더 넣고 싶은 것? | 한파 특수 이펙트 |

이 단계의 핵심: **답변이 구체적일수록 다음 결정이 쉬워진다.** "재밌는 게임"보다는 "고드름이 떨어지면 피하는 게임"이 훨씬 나아요.

### 2-3. 시장 조사 (Layer 1 / 2 / 3 분석)

AI가 웹 검색을 돌렸습니다:
- **Layer 1 (이미 알려진 것)**: 피하기 게임 공식은 표준화되어 있음
- **Layer 2 (현재 트렌드)**: 2026년 브라우저 게임은 즉시 플레이 + 소셜 공유가 핵심
- **Layer 3 (이 프로젝트만의 통찰)**: 겨울/한파 테마 + 점점 빨라지는 압박감의 조합은 틈새

### 2-4. 전제 확인 (Premise Challenge)

AI가 4개 전제를 제시했습니다:
1. 브라우저-퍼스트 (설치 없이 링크 공유) ✅
2. 핵심 메커니즘은 "점점 빠르게" ✅
3. 한파 시각 이펙트가 게임의 기억에 남는 요소 ❓
4. PC 키보드 조작 ✅

내가 **3번을 수정**했습니다: "이펙트보다 게임플레이가 핵심"

→ 이 한 줄 수정으로 후속 결정 전부가 달라집니다. 화려함보다 압박감의 곡선에 집중하는 방향으로.

### 2-5. 두 번째 의견 (Cross-Model Second Opinion)

AI가 다른 AI(서브에이전트)에게 같은 정보를 주고 의견을 받았습니다. "Blizzard Survival" 컨셉 — 점수 대신 **생존 시간**으로 표시하면 친구들과 공유하기 더 자연스럽다는 인사이트가 나왔습니다. 이 의견을 디자인에 반영.

### 2-6. 3가지 구현 방식 비교

AI가 3개 대안을 표로 정리했습니다:

| | A: 순수 HTML Canvas | B: Kaboom.js | C: p5.js |
|---|---|---|---|
| 노력 | S (1-2시간) | M (3-5시간) | M (3-4시간) |
| 의존성 | 없음 | CDN 한 줄 | CDN 한 줄 |
| 학습 곡선 | 직접 구현 | API 학습 | API 학습 |
| 비주얼 | 직접 그리기 | 내장 | 강함 |

내가 선택: **A (순수 HTML Canvas)** — 외부 의존성 없이 완전한 제어권.

### 2-7. 디자인 문서 자동 생성

AI가 위 모든 결정을 종합해 **디자인 문서**를 자동 생성했습니다 (`design-2026....md`). 그리고 또 다른 AI 서브에이전트가 이 문서를 검토 (어드버서리얼 리뷰):
- 1차: **6/10** (모바일 vs PC 모순, 가속 곡선 상한 누락 등 발견)
- 수정 후 2차: **8/10** ✅

**1장 끝났을 때 결과물**: 한 장짜리 디자인 문서. 코드는 아직 한 줄도 안 썼습니다.

---

## 📖 3장: 엔지니어링 검토 (`/plan-eng-review`)

디자인 문서를 가지고 `/gstack-plan-eng-review`를 호출했습니다. 이 스킬은 코딩 시작 **전에** 설계의 문제점을 잡아냅니다.

### 3-1. 스코프 검증

AI가 확인:
- 기존 재사용할 코드: 없음 (빈 프로젝트)
- 변경 파일 수: 1개 → 8개 임계점 한참 아래, 적절
- 배포 계획 명시: ✅ GitHub Pages

### 3-2. 아키텍처 리뷰 — 첫 큰 발견

AI가 **수학적으로** 디자인의 버그를 찾아냈습니다:

```
원래 계획:
- 장애물 속도: 200 → 600 px/s (3배)
- 스폰 간격: 명시 안 됨 (고정으로 가정)

문제:
- 속도 3배 빨라지면 → 화면 통과 시간 1/3
- 스폰 간격이 고정이면 → 화면 위 동시 장애물 수도 1/3
- 결과: 게임이 빨라질수록 더 쉬워짐 (의도와 정반대!)
```

→ 결정: `spawnInterval = baseInterval × (initialSpeed / currentSpeed)` 공식으로 자동 동기화.

**이 단계가 없었다면 어떻게 됐을까?** 코드 다 짠 다음에 친구가 "이거 시간 갈수록 더 쉬워지는데?" 한 마디에 게임 로직 전체를 갈아엎어야 했을 겁니다.

### 3-3. 테스트 전략

AI 추천: 해커톤 규모니까 수동 테스트 체크리스트만 권장 (B 옵션).

내 결정: **A — 풀 테스트 셋업** (Vitest + Playwright). 글로벌 CLAUDE.md에 "Well-tested code is non-negotiable"라고 적혀있어서.

→ 이 결정이 후속 코드 구조를 모듈러로 바꾸게 했습니다. (단일 HTML 파일 → src/ 모듈 + tests/)

### 3-4. 두 번째 의견 (다시 한 번)

다른 AI 서브에이전트가 6개 추가 지적:
1. "한파" 테마가 단순 스킨일 뿐 메커니즘에 녹아있지 않음 → **모닥불 메커니즘 추가**로 해결
2. 3→5 레인 전환은 UX 버그 위험 → **3레인 고정**으로 단순화
3. 최고 속도에서 게임이 풀 수 없는 상태 가능 → **"항상 한 레인 빔" 보장** 알고리즘 추가
4. Playwright는 과잉 (이미 결정함, 패스)
5. 모바일 미지원 (이미 결정함, 패스)
6. 점수 공유 메커니즘 없음 → **TODOS.md에 캡처** (나중에)

### 3-5. 디자인 문서 업데이트

7개 결정(D1~D7)이 디자인 문서에 반영됐습니다. 체크포인트:

```
✅ 스폰 밀도 버그 수정
✅ 풀 테스트 셋업
✅ 솔버빌리티 보장 (수학적 검증)
✅ 레인 수 고정
✅ 테마-메커니즘 정합성 (모닥불)
✅ TODOS.md 생성
```

**3장 끝났을 때 결과물**: 검증 완료된 디자인 문서 + 테스트 계획서 + TODOS.md. **여전히 코드는 한 줄도 안 썼습니다.**

---

## 📖 4장: 코드 작성 — TDD (`/superpowers:test-driven-development`)

이제 본격 구현. **TDD(테스트 주도 개발)** 원칙을 따랐습니다:

```
RED   → 테스트를 먼저 쓴다 (실패함, 함수가 아직 없으니까)
GREEN → 테스트가 통과할 만큼만 최소 코드 작성
REFACTOR → 정리
```

### 4-1. 환경 셋업 (10분)

```bash
npm init -y
npm install --save-dev vite vitest @playwright/test
npx playwright install chromium
```

설정 파일 3개:
- `package.json`: 의존성과 스크립트
- `vite.config.js`: Vite + Vitest 통합 설정
- `playwright.config.js`: E2E 테스트 설정

### 4-2. 첫 모듈: speed.js (가속 곡선)

**RED 단계**: 테스트 먼저 작성 (`tests/unit/speed.test.js`):

```javascript
import { currentSpeed, INITIAL_SPEED, MAX_SPEED } from '../../src/speed.js';

it('returns INITIAL_SPEED at t=0', () => {
  expect(currentSpeed(0)).toBe(INITIAL_SPEED);
});

it('reaches MAX_SPEED at t=80', () => {
  expect(currentSpeed(80)).toBe(MAX_SPEED);
});
// ... 19개 테스트
```

`npm test` 실행 → "Cannot find module './speed.js'" 에러로 19개 모두 실패.
**왜 일부러 실패시키나?** 테스트가 실제로 코드를 검증하는지 확인하기 위해. "테스트가 실패하는 걸 본 적이 없으면, 그게 진짜 테스트하는지 알 수 없다."

**GREEN 단계**: 최소 구현 (`src/speed.js`):

```javascript
export const INITIAL_SPEED = 200;
export const MAX_SPEED = 600;
// ...
export function currentSpeed(elapsedSec) {
  const level = Math.floor(elapsedSec / 10);
  return Math.min(INITIAL_SPEED + level * 50, MAX_SPEED);
}
```

`npm test` 실행 → **19/19 통과** ✅

### 4-3. 같은 패턴으로 4개 모듈

| 모듈 | 역할 | 테스트 수 | 누적 |
|------|-----|---------|------|
| `speed.js` | 가속 곡선, 스폰 간격 계산 | 19 | 19 |
| `collision.js` | AABB 박스 충돌 감지 | 10 | 29 |
| `score.js` | 시간 누적, 보너스 점수 | 11 | 40 |
| `obstacle.js` | 장애물/모닥불 스폰, 솔버빌리티 보장 | 15 | 55 |

특히 `obstacle.js`의 솔버빌리티 보장 테스트가 핵심:

```javascript
it('guarantees at least one lane always free across many random spawns', () => {
  for (let i = 0; i < 1000; i++) {
    const lane = pickSafeLane(inFlight);
    // ... 1000번 랜덤 시뮬레이션
    expect(lanesCovered.size).toBeLessThan(LANE_COUNT);
  }
});
```

**1000번 랜덤 돌려도 막힌 상황이 없으면** 수학적으로 솔버블함이 증명됩니다.

### 4-4. 통합: main.js + index.html

순수 모듈 4개를 `src/main.js`에서 조합:
- 게임 루프 (`requestAnimationFrame`)
- 상태 머신 (start / playing / over)
- Canvas 렌더링 (이모지 🧊 🔥 🧑 사용)
- 키보드 입력 처리

`index.html`은 30줄로 깔끔: Canvas 태그 하나 + main.js import.

### 4-5. E2E 테스트 (Playwright)

실제 브라우저를 띄워서 검증:

```javascript
test('Space key transitions start → playing', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Space');
  await page.waitForFunction(() => window.__GAME__.getPhase() === 'playing');
});
```

**5/5 통과** ✅

**4장 끝났을 때 결과물:**
- 실행 가능한 게임
- 단위 테스트 55개 + E2E 5개 모두 통과
- 프로덕션 빌드 검증 완료 (5.27kB JS + 1.46kB HTML)

---

## 📖 5장: 배포 — GitHub Pages

### 5-1. GitHub Actions 워크플로

`.github/workflows/deploy.yml` 작성:

```yaml
on:
  push:
    branches: [main]
jobs:
  build:
    - npm ci
    - npm test          # 테스트 통과해야 빌드
    - npm run build     # dist/ 생성
  deploy:
    needs: build
    - actions/deploy-pages@v4
```

**의미**: main 브랜치에 push할 때마다 자동으로
1. 테스트 실행
2. Vite 빌드
3. GitHub Pages 업로드

### 5-2. git 초기화 + 첫 커밋

```bash
git init -b main
git add .
git commit -m "feat: 한파 피하기 게임 초기 구현"
```

### 5-3. GitHub 저장소 연결

`gh` CLI가 설치 안 되어 있어서 수동으로:
1. https://github.com/new 에서 저장소 생성 (Public, 빈 상태)
2. `git remote add origin https://github.com/abback-go/Cold2.git`
3. `git push -u origin main`

### 5-4. 첫 배포 실패 (이게 정상입니다)

자동으로 워크플로 실행됐지만 deploy 단계에서 **404 에러**:

```
Error: Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

**원인**: 새 저장소는 기본값이 Pages **비활성**. 활성화 전에 워크플로가 먼저 돌아서 실패.

이건 **거의 모든 사람이 처음 한 번 겪는 문제**입니다. 닭이 먼저냐 달걀이 먼저냐 같은 상황.

### 5-5. Pages 활성화 + 재배포

1. https://github.com/abback-go/Cold2/settings/pages 접속
2. Source 드롭다운 → **GitHub Actions** 선택
3. 빈 커밋으로 워크플로 재트리거:

```bash
git commit --allow-empty -m "ci: trigger Pages deploy after enabling Pages source"
git push
```

이번엔 build ✅ → deploy ✅ → 배포 완료.

**최종 URL**: https://abback-go.github.io/Cold2/

---

## 📖 6장: 시나리오 정리

배포까지 끝난 후, 이 게임을 **플레이어 관점에서** 어떻게 봐야 하는지 별도 문서로 정리했습니다 (`scenario-2026....md`):
- 컨셉 한 줄
- 배경 스토리
- 캐릭터/오브젝트
- 시간대별 페이즈 (0-10초: 첫 한파 → 80초+: 영원한 겨울)
- 정서 곡선 그래프
- 사회적 동력 (친구들 사이 경쟁이 바이럴되는 흐름)

**디자인 문서가 "어떻게 만들지"였다면 시나리오 문서는 "어떤 경험을 줄지"입니다.**

---

## 🗂 만들어진 파일들 정리

### 프로젝트 폴더 (`C:\Abback\CladeCode\Cold Project2\`)

```
.github/workflows/deploy.yml   GitHub Actions 자동 배포
.gitignore
CLAUDE.md                       gstack 라우팅 룰
MAKING.md                       이 파일 (제작기)
README.md                       플레이/개발/배포 가이드
TODOS.md                        미루어둔 작업 (점수 공유)
index.html                      게임 진입점
package.json
vite.config.js
playwright.config.js
src/
├── speed.js                    가속 곡선 (pure)
├── collision.js                AABB 충돌 (pure)
├── score.js                    점수 (pure)
├── obstacle.js                 스폰 + 솔버빌리티 (pure)
└── main.js                     게임 루프 + 상태머신 + Canvas
tests/
├── unit/
│   ├── speed.test.js           19 테스트
│   ├── collision.test.js       10 테스트
│   ├── score.test.js           11 테스트
│   └── obstacle.test.js        15 테스트
└── e2e/
    └── game.spec.js            5 E2E 테스트
```

### gstack 글로벌 디렉터리 (`C:\Users\정지영\.gstack\projects\ColdProject2\`)

```
*-design-*.md                   디자인 문서 (1장에서 작성, 3장에서 업데이트)
*-eng-review-test-plan-*.md     테스트 계획서
*-scenario-*.md                 시나리오 문서
timeline.jsonl                  세션 기록
```

---

## 💡 초보자가 따라하려면

### 1. 환경 준비

```bash
# Node.js 설치 (https://nodejs.org)
# git 설치 (https://git-scm.com)
# GitHub 계정 만들기 (https://github.com)
```

### 2. Claude Code + gstack 설치

- Claude Code 설치: https://claude.com/claude-code
- gstack 스킬 설치: https://github.com/garrytan/gstack 안내 따라하기

### 3. 핵심 흐름

각 단계의 슬래시 명령어를 순서대로:

```
/gstack-office-hours       ← 아이디어 다듬기
/gstack-plan-eng-review    ← 엔지니어링 검토
/superpowers:test-driven-development  ← 코드 짜기
```

### 4. 배포

```bash
# git 초기화
git init -b main && git add . && git commit -m "first"

# GitHub.com에서 새 저장소 만들기 (Public)
# 그 다음:
git remote add origin <저장소 URL>
git push -u origin main

# GitHub.com → Settings → Pages → Source = GitHub Actions
# (만약 첫 배포 실패하면 빈 커밋 push로 재시도)
git commit --allow-empty -m "retrigger" && git push
```

---

## 🎓 배운 것 (회고)

### 코드를 짜기 전에 시간을 쓰는 게 결과적으로 빠릅니다

전체 작업 시간 중:
- **1장 + 2장 + 3장 (생각/검토)**: 약 1시간
- **4장 (실제 코드)**: 약 1시간
- **5장 (배포)**: 약 30분

코드 작성보다 **앞 단계에 더 많은 시간**을 썼는데, 그 덕분에 한 번도 큰 갈아엎기 없이 끝났습니다. 만약 1장에서 바로 코드부터 짰다면:
- 가속 곡선 버그 → 출시 후 발견 → 게임 로직 재설계
- 솔버빌리티 미보장 → 친구가 "이거 풀 수 없어" → 알고리즘 재구현
- 테마-메커니즘 분리 → "왜 한파야?" 피드백 → 모닥불 추가 위해 코드 수정

### TDD가 처음엔 답답해 보이지만 실제로는 빠릅니다

테스트를 먼저 쓰면 "이 함수가 정확히 무엇을 하는가"를 강제로 명확히 합니다. 그 후 구현은 거의 자동으로 따라옵니다. 게다가 1000번 랜덤 시뮬레이션 같은 검증을 5분 만에 추가할 수 있어요.

### AI는 검증/검토에 강합니다

내가 한 핵심 결정들을 다시 살펴보면:
- **테마 메커니즘 추가**: AI 두 번째 의견이 지적
- **솔버빌리티 보장**: AI 두 번째 의견이 수학적으로 지적
- **가속 + 스폰 동기화**: AI 엔지니어 리뷰가 발견

이 3개 모두 AI가 없었으면 출시 후에야 발견했을 것들입니다.

### 첫 GitHub Pages 배포는 거의 무조건 한 번 실패합니다

Pages 활성화 vs 워크플로 실행의 닭달걀 문제. 이걸 모르고 시작하면 "내가 뭘 잘못했지?" 패닉할 수 있는데, **정상적인 흐름**이라는 걸 알면 침착하게 처리 가능.

---

## 📺 결과 보기

게임 플레이: https://abback-go.github.io/Cold2/
저장소 코드: https://github.com/abback-go/Cold2

화살표 ←→ 로 이동, Space로 시작, R로 재시작.
🔥 모닥불을 만나면 +5점 + 0.5초 슬로우모.

친구들과 점수 경쟁해보세요. **17.3초 vs 23.5초** 같은 비교가 자연스럽게 됩니다.

---

*작성일: 2026-05-09*
*제작: 한 사람과 Claude (Anthropic의 AI 어시스턴트)*
