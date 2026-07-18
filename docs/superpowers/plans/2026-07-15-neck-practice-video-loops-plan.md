# Neck Practice Video Loops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add silent five-second MP4 loops for both presenters in `5 минут для шеи`, with existing PNG posters as fallback.

**Architecture:** A new `PracticeVideoLoop` resolves MP4/poster URLs from presenter and step ID. `PracticePage` renders it only for `practice.id === 'neck'`; every other practice retains `CrossfadePoseIllustration`.

**Tech Stack:** React 19, TypeScript, Vitest, Playwright, MP4/H.264, VideoAgent Video Studio.

## Global Constraints

- Generate twelve H.264 clips: six neck steps times two presenters.
- Preserve approved identity, outfit, full body, mat, green wall and plant.
- Use autoplay, muted, loop, playsInline and no controls; do not preload future videos.
- Keep poster before canplay, after video error and when reduced motion is preferred.
- Do not change timers, sequence, other practices, commit or deploy.

### Task 1: Generate benchmark videos

**Files:** create `web/public/videos/female/neck-preparation.mp4` and `web/public/videos/male/neck-preparation.mp4`.

- [ ] Check `node C:/Users/User/.agents/skills/videoagent-video-studio/tools/generate.js --list-models` and `Get-Command ffmpeg`.
- [ ] Generate female and male `neck-preparation` separately via VideoAgent image-to-video from their deployed PNG references, `minimax`, five seconds, `3:4`.
- [ ] Prompts must lock camera and preserve the approved person/studio while showing calm breathing, minor shoulder release and neck lengthening; no crop, text, audio or extra people.
- [ ] Download each `videoUrl`, transcode with `ffmpeg` to silent H.264, 720 px wide, 24 fps, fast-start, under 2 MB.
- [ ] Visually inspect identity, outfit, full body, technique, anatomy and loop continuity; show both clips to the user and stop until approval.

### Task 2: Generate the remaining ten clips

**Files:** create `web/public/videos/{female,male}/{neck-right-tilt,neck-left-tilt,neck-turns,neck-lengthen,neck-rest}.mp4`.

- [ ] After benchmark approval, generate each matching PNG through VideoAgent with the same fixed-camera prompt and five-second `3:4` configuration.
- [ ] Motions: each tilt returns to centre; turns move right through centre to left; lengthening raises through the crown with relaxed shoulders; rest shows soft breathing and release.
- [ ] Normalize every result through the same ffmpeg profile and regenerate any clip with changed identity, cropped body, missing room elements, incorrect technique, anatomy error or visible loop jump.

### Task 3: Implement video/poster fallback

**Files:** create `web/src/components/PracticeVideoLoop.tsx` and `web/src/components/PracticeVideoLoop.test.tsx`; modify `web/src/styles.css`.

- [ ] First write tests for poster/video sources, muted/loop/playsInline/autoplay attributes, pre-canplay poster, error fallback and reduced-motion fallback. Run `npm.cmd test -- src/components/PracticeVideoLoop.test.tsx`; it must fail before implementation.
- [ ] Export `getPracticeVideoSource(stepId, presenter)` as `/videos/${presenter}/${stepId}.mp4` and `getPracticePosterSource(stepId, presenter)` as `/images/${presenter}/${stepId}.png`.
- [ ] Render absolute poster/video layers with `preload="metadata"`; reveal only on canplay, retain poster after error, reset on step or presenter changes, and hide video in the existing reduced-motion media rule.
- [ ] Re-run the component test; it must pass.

### Task 4: Route video only to the neck practice

**Files:** modify `web/src/pages/PracticePage.tsx` and `web/src/data/presenterAssetCoverage.test.ts`.

- [ ] First add failing tests: neck renders `data-testid="practice-video"`; shoulders does not; all six IDs for female and male resolve to existing MP4s and PNG posters.
- [ ] Replace the visual expression with `practice.id === 'neck' ? <PracticeVideoLoop presenter={presenter} stepId={step.id} /> : <CrossfadePoseIllustration presenter={presenter} stepId={step.id} />`.
- [ ] Run `npm.cmd test -- src/data/presenterAssetCoverage.test.ts src/pages/PracticePage.test.tsx`; it must pass.

### Task 5: Verify iPhone flows

**Files:** modify `web/e2e/spine-flow.spec.ts` and `.agent-work/tasks/todo.md`.

- [ ] For both presenters at `375x812`, assert the preparation video source and muted/loop/playsInline properties, advance to `neck-right-tilt`, assert its source, and capture screenshots with video, instruction, timer and controls in view.
- [ ] Run `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`, and `git diff --check`; all must pass.
- [ ] Review screenshots for clipping, overlap and layout shift, then record actual checks in task memory. Do not deploy.
