# TODOS

## Deferred from /plan-eng-review (2026-05-09)

### [P3] 점수 공유 메커니즘
- **What**: 게임 오버 화면에서 점수를 친구에게 공유할 수 있는 기능
- **Why**: 친구끼리 경쟁이 게임 핵심 동력. 현재는 URL만 공유 가능, 점수는 스크린샷에 의존
- **Pros**: 바이럴성, "한 번 더 해봐!" 입소문 동력 제공
- **Cons**: 해커톤 핵심 루프 검증 후 추가가 안전. 우선순위 낮음
- **Context**: outside voice (codex/claude subagent)가 "URL은 공유되지만 점수 공유는 없음 — 친구끼리 경쟁이 핵심 동력인데 점수만 표시하고 끝"으로 지적
- **구현 옵션**:
  1. `navigator.share()` API — "17.3초 생존! 너도 해봐: [URL]"
  2. URL 쿼리 파라미터 — `?score=17.3`로 친구 점수 도전 모드
  3. localStorage 리더보드 — 자기 최고 점수만 저장
- **Depends on**: 게임 핵심 루프 완성 + 친구들 첫 플레이테스트 후 평가
