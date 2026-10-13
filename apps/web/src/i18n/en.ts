/**
 * The base locale and the single source of truth for interface strings.
 * Every other locale is a Partial of this type, so a missing key falls back to
 * English rather than showing a blank.
 */
export const en = {
  // ── Brand and chrome ──────────────────────────────────────────────────────
  "app.name": "RoadReady",
  "app.tagline": "Know every sign. Pass the theory test.",
  "app.disclaimer": "Study material based on the StVO. Not legal advice.",

  // ── Navigation ────────────────────────────────────────────────────────────
  "nav.dashboard": "Dashboard",
  "nav.learn": "Learn",
  "nav.signs": "Signs",
  "nav.practice": "Practice",
  "nav.scenarios": "Situations",
  "nav.finalTest": "Final Test",
  "nav.signOut": "Sign out",
  "nav.signIn": "Sign in",
  "nav.getStarted": "Get started",
  "nav.changeCountry": "Change country",

  // ── Common actions ────────────────────────────────────────────────────────
  "action.start": "Start",
  "action.retry": "Retry",
  "action.continue": "Continue",
  "action.next": "Next",
  "action.back": "Back",
  "action.close": "Close",
  "action.confirm": "Confirm",
  "action.tryAgain": "Try again",
  "action.open": "Open",
  "action.previous": "Previous",
  "action.markRead": "Mark as read",
  "action.markedRead": "Read",
  "action.backToDashboard": "Back to dashboard",
  "action.listen": "Listen",
  "action.stopListening": "Stop",
  "action.clearFilters": "Clear filters",
  "action.seeResults": "See results",

  // ── Status ────────────────────────────────────────────────────────────────
  "status.loading": "Loading…",
  "status.notStarted": "Not started",
  "status.inProgress": "In progress",
  "status.completed": "Completed",
  "status.passed": "Passed",
  "status.notPassed": "Not passed",
  "status.correct": "Correct",
  "status.incorrect": "Not quite",

  // ── Dashboard ─────────────────────────────────────────────────────────────
  "dashboard.heading": "Let's get you ready for the road",
  "dashboard.intro":
    "Learn the rules module by module, drill each topic until the answers are automatic, then sit the full theory test under exam conditions.",
  "dashboard.progress": "Your progress",
  "dashboard.modulesDone": "modules completed",
  "dashboard.topicsPassed": "topics passed",
  "dashboard.lastAttempt": "Last attempt",
  "dashboard.noAttempts": "No attempts yet.",
  "dashboard.learn.title": "Learning modules",
  "dashboard.learn.body":
    "The official curriculum in 14 modules, from fitness to drive to loading a trailer.",
  "dashboard.signs.title": "Signs Library",
  "dashboard.signs.body":
    "Every German sign, signal, road marking and plate combination — with what it means and what to do.",
  "dashboard.practice.title": "Practice Tests",
  "dashboard.practice.body":
    "Topic-by-topic question sets with an explanation after every answer. Wrong answers never end the run.",
  "dashboard.scenarios.title": "Scenario Practice",
  "dashboard.scenarios.body":
    "Illustrated driving situations that test judgement, not just recall of the sign catalogue.",
  "dashboard.finalTest.title": "Take the Final Theory Test",
  "dashboard.finalTest.body":
    "30 questions · 45 minutes · at most 10 error points",
  "dashboard.comingSoon": "Content for {country} is still being written",
  "dashboard.comingSoonBody":
    "The German course is complete. Switch country from the badge in the header to start there.",

  // ── Learn ─────────────────────────────────────────────────────────────────
  "learn.heading": "Learning modules",
  "learn.intro":
    "The official German curriculum: twelve basic lessons and two for class B. Read them in order, or jump to what you need.",
  "learn.grundstoff": "Basic material (Grundstoff)",
  "learn.zusatzstoff": "Class B supplement (Zusatzstoff)",
  "learn.lessons": "lessons",
  "learn.questions": "questions",
  "learn.minutes": "min",
  "learn.lessonOf": "Lesson {current} of {total}",
  "learn.keyPoints": "Remember this",
  "learn.relatedSigns": "Signs in this lesson",
  "learn.moduleComplete": "Module complete",
  "learn.moduleCompleteBody":
    "You have read every lesson here. Test yourself to make it stick.",
  "learn.testYourself": "Test yourself on this module",
  "learn.backToModules": "All modules",
  "learn.nextLesson": "Next lesson",
  "learn.nextModule": "Next module",
  "learn.previousModule": "Previous module",
  "learn.lastModule":
    "That was the last module. Sit the full theory test when you are ready.",
  "learn.officialTitle": "Official lesson",

  // ── Signs library ─────────────────────────────────────────────────────────
  "signs.heading": "German Traffic Signs",
  "signs.intro":
    "Every sign, light signal, road marking and supplementary plate you need for the theory test — including the combinations you actually meet on a German road.",
  "signs.search": "Search name, meaning or Zeichen number…",
  "signs.all": "All",
  "signs.count": "{count} signs",
  "signs.noResults": "No signs match that search",
  "signs.noResultsBody":
    "Try a different word, or clear the filters to browse the whole catalogue.",
  "signs.whatItMeans": "What it means",
  "signs.whatToDo": "What to do",
  "signs.legalBasis": "Legal basis",

  // ── Practice ──────────────────────────────────────────────────────────────
  "practice.heading": "Practice Tests",
  "practice.intro":
    "Focused topics with an explanation after every answer. A wrong answer never ends the run — keep going and learn as you move.",
  "practice.questionOf": "Question {current} of {total}",
  "practice.correctCount": "{count} correct",
  "practice.keyHint": "Keys: A–D to choose · Enter to {action}",
  "practice.lastScore": "Last score",
  "practice.bestScore": "Best",
  "practice.attempts": "attempts",
  "practice.breakdown": "Question breakdown",
  "practice.yourAnswer": "Your answer:",
  "practice.correctAnswer": "Correct:",
  "practice.notAnswered": "Not answered",
  "practice.backToTopics": "Back to topics",
  "practice.noTopics": "No topics for {country} yet",

  // ── Scenarios ─────────────────────────────────────────────────────────────
  "scenarios.heading": "Scenario Practice",
  "scenarios.intro":
    "Real situations rather than isolated signs. Read the scene, decide what you would do, then check it against the rule.",
  "scenarios.count": "{count} situations",
  "scenarios.answered": "{count} answered correctly",
  "scenarios.situation": "Situation {current} of {total}",
  "scenarios.nextSituation": "Next situation",
  "scenarios.none": "No situations for {country} yet",

  // ── Final test ────────────────────────────────────────────────────────────
  "test.heading": "Final Theory Test",
  "test.subheading": "Mixed questions from the whole curriculum",
  "test.questions": "Questions",
  "test.timeLimit": "Time limit",
  "test.toPass": "To pass",
  "test.errorPointsMax": "max 10 error points",
  "test.rule1":
    "20 questions from the basic material and 10 from the class-B supplement, as in the real exam.",
  "test.rule2":
    "Questions are weighted 2 to 5 error points. You may collect at most 10.",
  "test.rule3":
    "Getting two 5-point questions wrong fails the test, even under 10 points.",
  "test.rule4":
    "No feedback during the test — the full breakdown comes at the end.",
  "test.rule5": "You can go back and change an answer while the clock runs.",
  "test.rule6": "Running out of time submits the answers you have given.",
  "test.start": "Start test",
  "test.preparing": "Preparing test…",
  "test.grading": "Grading your test…",
  "test.questionNumber": "Question {current} / {total}",
  "test.answeredCount": "{answered} of {total} answered",
  "test.finish": "Finish and grade",
  "test.jumpTo": "Jump to question",
  "test.errorPoints": "Error points",
  "test.resultPassed":
    "That is a pass. Keep drilling the topics where you lost marks so the answers stay automatic on test day.",
  "test.resultFailed":
    "You needed 10 error points or fewer. Work through the explanations below, then run the modules that cost you the most.",
  "test.failedFivePoint":
    "Two 5-point questions were wrong, which fails the test on its own.",
  "test.unanswered":
    "{count} question(s) were left unanswered and counted as wrong.",

  // ── Auth ──────────────────────────────────────────────────────────────────
  "auth.signIn": "Sign In",
  "auth.createAccount": "Create Account",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.noAccount": "No account yet?",
  "auth.haveAccount": "Already have an account?",

  // ── Country select ────────────────────────────────────────────────────────
  "country.heading": "Where are you learning to drive?",
  "country.intro":
    "Rules, signs and tests are country-specific. You can change this later from the header.",
  "country.select": "Select a country",
  "country.continue": "Continue",
  "country.settingUp": "Setting up…",
  "country.noInfo": "No information available for this country yet.",

  // ── Settings ──────────────────────────────────────────────────────────────
  "settings.language": "Language",
  "settings.theme": "Theme",
  "theme.study": "Study",
  "theme.wood": "Wood",
  "theme.greenboard": "Green board",
  "theme.blackboard": "Blackboard",
  "theme.daylight": "Daylight",
  "theme.contrast": "High contrast",

  // ── Errors ────────────────────────────────────────────────────────────────
  "error.generic": "Something went wrong. Please try again.",
  "error.loadFailed": "Could not load that content.",
  "error.retry": "Try again",
} as const;

export type TranslationKey = keyof typeof en;
export type Translations = Record<TranslationKey, string>;
