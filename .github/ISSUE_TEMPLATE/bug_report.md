---
name: Bug report
about: Something isn't working correctly in RoadReady
title: "[Bug] "
labels: bug
assignees: ""
---

## What happened?

<!-- A clear description of the bug. What did you see? -->

## Steps to reproduce

1. Go to `http://localhost:5173` (or `https://roadready.online`)
2. <!-- next step -->
3. <!-- next step -->
4. See the error

## Expected behaviour

<!-- What should have happened? -->

## Actual behaviour

<!-- What actually happened? Attach a screenshot or screen recording if it helps. -->

---

## Where does this occur?

<!-- Check all that apply -->

- [ ] 3D simulation / car physics (steering, braking, drift)
- [ ] Scenario logic (MCQ pause, question overlay, pass/fail)
- [ ] Home page — country selector or scenario list
- [ ] Auth — login, register, or session restore on page refresh
- [ ] API / backend (Express route returning wrong data or an error)
- [ ] Database / Prisma query
- [ ] UI layout / Tailwind styling
- [ ] Other: <!-- describe -->

**Country and scenario (if simulation-related):**

<!-- e.g. Germany → roundabout, France → fr-speed-limits, or N/A -->

---

## Environment

| Field                         | Value                                         |
| ----------------------------- | --------------------------------------------- |
| Browser + version             | <!-- Chrome 124 / Firefox 126 / Safari 17 --> |
| OS                            | <!-- macOS 14 / Windows 11 / Ubuntu 22.04 --> |
| Node.js (`node -v`)           | <!-- e.g. v20.11.0 -->                        |
| Running locally or production | <!-- local / https://roadready.online -->     |

---

## Console errors

**Browser DevTools console** (`F12 → Console`):

```
(paste errors here, or write "none")
```

**API server terminal** (`npm run dev:api` output):

```
(paste errors here, or write "none")
```

---

## Additional context

<!-- Anything else — links to related code, recent changes, or a theory about the cause. -->
