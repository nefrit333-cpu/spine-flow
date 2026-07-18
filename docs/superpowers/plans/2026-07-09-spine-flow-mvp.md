# Spine Flow MVP Implementation Plan (superseded)

> This SwiftUI/iOS plan was superseded by the approved iPhone-first web/PWA direction on 2026-07-10. Do not execute it. A separate web implementation plan will replace it.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free, offline SwiftUI iPhone app with five short Russian-language yoga practices and local progress.

**Architecture:** The app contains a bundled practice catalog, a small session state object for navigation and timing, and a `UserDefaults`-backed progress store. `HomeView` selects a practice, `PracticeView` runs its steps, and `CompletionView` records the result before returning home.

**Tech Stack:** Swift, SwiftUI, XCTest, XCUITest, deployment target iOS 17+, release build with Xcode 26+ and the iOS 26 SDK.

## Global Constraints

- Target iPhone devices running iOS 17 or newer.
- Use Xcode 26 or newer with the iOS 26 SDK for App Store Connect uploads.
- Use SwiftUI and Apple frameworks only; do not add third-party packages.
- All user-facing copy is in Russian.
- Bundle five practices and make them usable without network access.
- Do not add accounts, networking, analytics, ads, purchases, subscriptions, video, or notifications.
- Position the product as wellness only: no medical diagnoses, treatment claims, or promises of pain relief.
- Persist only completion count, last practice identifier, and completion date in `UserDefaults`.

---

## Planned File Structure

```text
SpineFlow/
  SpineFlowApp.swift                 App entry point and app-wide state wiring
  Models/Practice.swift              Practice and step value types
  Models/UserProgress.swift          Persisted progress value type
  Catalog/PracticeCatalog.swift      Static, offline Russian-language content
  Services/ProgressStore.swift       UserDefaults persistence boundary
  Features/Session/PracticeSession.swift
                                    Session navigation, timer, pause and completion state
  Features/Home/HomeView.swift       Main screen, recommendation and practice library
  Features/Home/PracticeCardView.swift
                                    Reusable practice card
  Features/Practice/PracticeView.swift
                                    Active practice controls and lifecycle handling
  Features/Practice/PracticeStepView.swift
                                    Illustration placeholder, instruction and timer display
  Features/Completion/CompletionView.swift
                                    Completion confirmation and return action
  Features/Safety/SafetyNoticeView.swift
                                    One-time wellness warning
  Design/SpineTheme.swift            Colors, typography and spacing tokens
SpineFlowTests/
  PracticeSessionTests.swift         Timer, pause and step-navigation unit tests
  ProgressStoreTests.swift           Local persistence unit tests
  PracticeCatalogTests.swift         Catalog completeness and duration tests
SpineFlowUITests/
  SpineFlowUITests.swift             End-to-end primary user journey
```

### Task 1: Create the Xcode project and value models

**Files:**
- Create: `SpineFlow/SpineFlowApp.swift`
- Create: `SpineFlow/Models/Practice.swift`
- Create: `SpineFlow/Models/UserProgress.swift`
- Create: `SpineFlowTests/PracticeSessionTests.swift`

**Interfaces:**
- Produces: `Practice`, `PracticeStep`, `UserProgress`, and `SpineFlowApp`.
- Consumed by: catalog, progress store, session logic, and all views.

- [ ] **Step 1: Create an iOS App project in Xcode**

Use the App template with product name `SpineFlow`, interface `SwiftUI`, language `Swift`, tests enabled, and deployment target iOS 17. Create the groups shown in Planned File Structure. Do not add Core Data, CloudKit, or package dependencies.

- [ ] **Step 2: Write the failing model test**

```swift
import XCTest
@testable import SpineFlow

final class PracticeSessionTests: XCTestCase {
    func testPracticeHasTheSumOfItsStepDurations() {
        let practice = Practice(
            id: "neck",
            title: "5 минут для шеи",
            subtitle: "Мягкая пауза после работы",
            steps: [
                PracticeStep(id: "one", title: "Дыхание", instruction: "Сядьте ровно.", duration: 60),
                PracticeStep(id: "two", title: "Наклон", instruction: "Наклоните голову вправо.", duration: 60)
            ]
        )

        XCTAssertEqual(practice.totalDuration, 120)
    }
}
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeSessionTests`

Expected: compilation failure because `Practice` and `PracticeStep` do not exist yet.

- [ ] **Step 4: Implement the models**

```swift
import Foundation

struct Practice: Identifiable, Equatable {
    let id: String
    let title: String
    let subtitle: String
    let steps: [PracticeStep]

    var totalDuration: TimeInterval {
        steps.reduce(0) { $0 + $1.duration }
    }
}

struct PracticeStep: Identifiable, Equatable {
    let id: String
    let title: String
    let instruction: String
    let duration: TimeInterval
}
```

```swift
import Foundation

struct UserProgress: Equatable {
    var completedCount: Int = 0
    var lastPracticeID: String?
    var lastCompletedAt: Date?
}
```

- [ ] **Step 5: Run the unit test and build**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeSessionTests`

Expected: `TEST SUCCEEDED`.

- [ ] **Step 6: Commit the project foundation**

```bash
git add SpineFlow.xcodeproj SpineFlow SpineFlowTests
git commit -m "Создал основу нативного приложения Spine Flow"
```

### Task 2: Add the offline practice catalog

**Files:**
- Create: `SpineFlow/Catalog/PracticeCatalog.swift`
- Create: `SpineFlowTests/PracticeCatalogTests.swift`

**Interfaces:**
- Consumes: `Practice` and `PracticeStep` from Task 1.
- Produces: `PracticeCatalog.all` and `PracticeCatalog.recommended`.

- [ ] **Step 1: Write the failing catalog tests**

```swift
import XCTest
@testable import SpineFlow

final class PracticeCatalogTests: XCTestCase {
    func testCatalogContainsFivePractices() {
        XCTAssertEqual(PracticeCatalog.all.count, 5)
    }

    func testEveryPracticeHasStepsAndAPositiveDuration() {
        for practice in PracticeCatalog.all {
            XCTAssertFalse(practice.steps.isEmpty)
            XCTAssertGreaterThan(practice.totalDuration, 0)
        }
    }
}
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeCatalogTests`

Expected: compilation failure because `PracticeCatalog` does not exist.

- [ ] **Step 3: Implement the static catalog**

Create `PracticeCatalog` as an `enum` with a static `all` array. Define exactly five practices: `neck`, `shoulders`, `lower-back`, `desk-reset`, and `evening-back`. Each must contain explicit `PracticeStep` values with Russian title, instruction and duration. Use neutral wellness copy such as “Двигайтесь мягко, без дискомфорта” and do not describe a pose as treatment. Set `recommended` to the first practice in `all`.

```swift
enum PracticeCatalog {
    static let recommended = all[0]

    static let all: [Practice] = [
        Practice(
            id: "neck",
            title: "5 минут для шеи",
            subtitle: "Мягкая пауза после работы",
            steps: [
                PracticeStep(id: "neck-breath", title: "Подготовка", instruction: "Сядьте ровно и сделайте несколько спокойных вдохов.", duration: 60),
                PracticeStep(id: "neck-right", title: "Наклон вправо", instruction: "Мягко наклоните голову к правому плечу. Не тяните через дискомфорт.", duration: 60),
                PracticeStep(id: "neck-left", title: "Наклон влево", instruction: "Мягко наклоните голову к левому плечу. Дышите спокойно.", duration: 60),
                PracticeStep(id: "neck-turns", title: "Повороты", instruction: "Поверните голову вправо и влево в комфортной амплитуде.", duration: 60),
                PracticeStep(id: "neck-rest", title: "Пауза", instruction: "Вернитесь в нейтральное положение и расслабьте плечи.", duration: 60)
            ]
        ),
        Practice(
            id: "shoulders",
            title: "7 минут для плеч",
            subtitle: "Спокойная разгрузка верхней части тела",
            steps: [
                PracticeStep(id: "shoulders-breath", title: "Подготовка", instruction: "Сядьте ровно, стопы поставьте на пол.", duration: 60),
                PracticeStep(id: "shoulders-up", title: "Подъём плеч", instruction: "На вдохе поднимите плечи, на выдохе мягко опустите.", duration: 60),
                PracticeStep(id: "shoulders-circles", title: "Круги плечами", instruction: "Сделайте медленные круги плечами назад.", duration: 60),
                PracticeStep(id: "shoulders-open", title: "Раскрытие груди", instruction: "Уведите руки назад настолько, насколько комфортно.", duration: 90),
                PracticeStep(id: "shoulders-cross", title: "Растяжение руки", instruction: "Обнимите правую руку левой и затем поменяйте сторону.", duration: 90),
                PracticeStep(id: "shoulders-rest", title: "Пауза", instruction: "Опустите руки и сделайте несколько спокойных вдохов.", duration: 60)
            ]
        ),
        Practice(
            id: "lower-back",
            title: "10 минут для поясницы",
            subtitle: "Мягкое движение после долгого сидения",
            steps: [
                PracticeStep(id: "back-breath", title: "Подготовка", instruction: "Лягте на спину или сядьте устойчиво, как удобно.", duration: 60),
                PracticeStep(id: "back-pelvis", title: "Наклоны таза", instruction: "Мягко меняйте положение таза, не задерживая дыхание.", duration: 90),
                PracticeStep(id: "back-cat", title: "Кошка и корова", instruction: "На четвереньках округляйте и выпрямляйте спину в комфортной амплитуде.", duration: 120),
                PracticeStep(id: "back-child", title: "Поза ребёнка", instruction: "Опуститесь назад к пяткам, если положение комфортно для коленей.", duration: 120),
                PracticeStep(id: "back-twist", title: "Мягкий поворот", instruction: "Лёжа, согните колени и мягко направьте их в сторону, затем поменяйте сторону.", duration: 150),
                PracticeStep(id: "back-rest", title: "Пауза", instruction: "Вернитесь в нейтральное положение и отдохните.", duration: 60)
            ]
        ),
        Practice(
            id: "desk-reset",
            title: "12 минут после дня за столом",
            subtitle: "Неспешное переключение после работы",
            steps: [
                PracticeStep(id: "desk-breath", title: "Подготовка", instruction: "Встаньте или сядьте устойчиво, расслабьте челюсть и плечи.", duration: 60),
                PracticeStep(id: "desk-neck", title: "Шея", instruction: "Сделайте мягкие наклоны головы в каждую сторону.", duration: 120),
                PracticeStep(id: "desk-shoulders", title: "Плечи", instruction: "Прокрутите плечи назад и опустите их на выдохе.", duration: 120),
                PracticeStep(id: "desk-side", title: "Боковое вытяжение", instruction: "Потянитесь рукой вверх и слегка в сторону, затем поменяйте сторону.", duration: 180),
                PracticeStep(id: "desk-fold", title: "Наклон", instruction: "Наклонитесь вперёд только до комфортного положения.", duration: 120),
                PracticeStep(id: "desk-twist", title: "Поворот корпуса", instruction: "Сделайте плавный поворот вправо и влево без рывков.", duration: 120)
            ]
        ),
        Practice(
            id: "evening-back",
            title: "15 минут вечернего расслабления спины",
            subtitle: "Спокойное завершение дня",
            steps: [
                PracticeStep(id: "evening-breath", title: "Дыхание", instruction: "Устройтесь удобно и дышите медленно.", duration: 120),
                PracticeStep(id: "evening-cat", title: "Кошка и корова", instruction: "Двигайтесь плавно, не стремясь к большой амплитуде.", duration: 180),
                PracticeStep(id: "evening-child", title: "Поза ребёнка", instruction: "Останьтесь в положении, только если оно комфортно.", duration: 180),
                PracticeStep(id: "evening-twist", title: "Поворот лёжа", instruction: "Мягко поверните согнутые колени в сторону и поменяйте сторону.", duration: 180),
                PracticeStep(id: "evening-knees", title: "Колени к груди", instruction: "Лёжа на спине, мягко подтяните колени к себе.", duration: 120),
                PracticeStep(id: "evening-rest", title: "Отдых", instruction: "Полежите спокойно, наблюдая за дыханием.", duration: 120)
            ]
        )
    ]
}
```

- [ ] **Step 4: Run catalog tests**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeCatalogTests`

Expected: `TEST SUCCEEDED`.

- [ ] **Step 5: Commit the catalog**

```bash
git add SpineFlow/Catalog/PracticeCatalog.swift SpineFlowTests/PracticeCatalogTests.swift
git commit -m "Добавил офлайн-каталог практик Spine Flow"
```

### Task 3: Implement local progress persistence

**Files:**
- Create: `SpineFlow/Services/ProgressStore.swift`
- Create: `SpineFlowTests/ProgressStoreTests.swift`

**Interfaces:**
- Consumes: `UserProgress` from Task 1.
- Produces: `ProgressStore.load()`, `ProgressStore.recordCompletion(practiceID:at:)`, and `ProgressStore.reset()`.

- [ ] **Step 1: Write the failing persistence test**

```swift
import XCTest
@testable import SpineFlow

final class ProgressStoreTests: XCTestCase {
    func testRecordingCompletionPersistsTheLatestPractice() {
        let defaults = UserDefaults(suiteName: #function)!
        let store = ProgressStore(defaults: defaults)
        defer { defaults.removePersistentDomain(forName: #function) }

        let date = Date(timeIntervalSince1970: 1_720_000_000)
        store.recordCompletion(practiceID: "neck", at: date)

        XCTAssertEqual(store.load(), UserProgress(completedCount: 1, lastPracticeID: "neck", lastCompletedAt: date))
    }
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/ProgressStoreTests`

Expected: compilation failure because `ProgressStore` does not exist.

- [ ] **Step 3: Implement `ProgressStore`**

Use the keys `completedCount`, `lastPracticeID`, and `lastCompletedAt`. Read missing or invalid values as `UserProgress()`. `recordCompletion` increments `completedCount`, replaces the last practice and date, then saves all three values.

```swift
import Foundation

final class ProgressStore {
    private let defaults: UserDefaults
    private let completedCountKey = "completedCount"
    private let lastPracticeIDKey = "lastPracticeID"
    private let lastCompletedAtKey = "lastCompletedAt"

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func load() -> UserProgress {
        UserProgress(
            completedCount: max(0, defaults.integer(forKey: completedCountKey)),
            lastPracticeID: defaults.string(forKey: lastPracticeIDKey),
            lastCompletedAt: defaults.object(forKey: lastCompletedAtKey) as? Date
        )
    }

    func recordCompletion(practiceID: String, at date: Date = .now) {
        let progress = load()
        defaults.set(progress.completedCount + 1, forKey: completedCountKey)
        defaults.set(practiceID, forKey: lastPracticeIDKey)
        defaults.set(date, forKey: lastCompletedAtKey)
    }

    func reset() {
        defaults.removeObject(forKey: completedCountKey)
        defaults.removeObject(forKey: lastPracticeIDKey)
        defaults.removeObject(forKey: lastCompletedAtKey)
    }
}
```

- [ ] **Step 4: Run persistence tests**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/ProgressStoreTests`

Expected: `TEST SUCCEEDED`.

- [ ] **Step 5: Commit local persistence**

```bash
git add SpineFlow/Services/ProgressStore.swift SpineFlowTests/ProgressStoreTests.swift
git commit -m "Добавил локальное сохранение прогресса"
```

### Task 4: Implement practice-session state and timer

**Files:**
- Create: `SpineFlow/Features/Session/PracticeSession.swift`
- Modify: `SpineFlowTests/PracticeSessionTests.swift`

**Interfaces:**
- Consumes: `Practice` and `PracticeStep` from Task 1.
- Produces: observable `PracticeSession` with `currentStep`, `remainingSeconds`, `isPaused`, `goNext()`, `goBack()`, `pause()`, `resume(at:)`, and `finish()`.

- [ ] **Step 1: Add failing timer tests**

```swift
func testPauseKeepsTheRemainingTimeStable() {
    let practice = Practice(id: "test", title: "Тест", subtitle: "", steps: [
        PracticeStep(id: "step", title: "Шаг", instruction: "", duration: 60)
    ])
    let session = PracticeSession(practice: practice, startedAt: .now)

    session.pause(at: Date.now.addingTimeInterval(15))

    XCTAssertTrue(session.isPaused)
    XCTAssertEqual(session.remainingSeconds, 45)
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeSessionTests`

Expected: compilation failure because `PracticeSession` does not exist.

- [ ] **Step 3: Implement session logic**

Store the selected practice, current step index, the time the current step began, a paused remaining value, and completion state. Compute elapsed time from the current clock whenever the view appears or the app becomes active. A finished step advances automatically; `goNext()` and `goBack()` reset the current step timer and clamp the index to the valid range.

```swift
@MainActor
final class PracticeSession: ObservableObject {
    @Published private(set) var currentStepIndex = 0
    @Published private(set) var remainingSeconds: Int
    @Published private(set) var isPaused = false
    @Published private(set) var isFinished = false

    let practice: Practice
    private var stepStartedAt: Date
    private var pausedSeconds: Int?

    init(practice: Practice, startedAt: Date = .now) {
        self.practice = practice
        self.remainingSeconds = Int(practice.steps[0].duration)
        self.stepStartedAt = startedAt
    }

    var currentStep: PracticeStep { practice.steps[currentStepIndex] }

    func update(at date: Date = .now) {
        guard !isPaused, !isFinished else { return }
        remainingSeconds = max(0, Int(currentStep.duration - date.timeIntervalSince(stepStartedAt)))
        if remainingSeconds == 0 { goNext(at: date) }
    }

    func pause(at date: Date = .now) {
        update(at: date)
        pausedSeconds = remainingSeconds
        isPaused = true
    }

    func resume(at date: Date = .now) {
        guard let pausedSeconds else { return }
        stepStartedAt = date.addingTimeInterval(-currentStep.duration + TimeInterval(pausedSeconds))
        self.pausedSeconds = nil
        isPaused = false
    }

    func goNext(at date: Date = .now) {
        guard currentStepIndex < practice.steps.count - 1 else {
            isFinished = true
            return
        }
        currentStepIndex += 1
        resetStep(at: date)
    }

    func goBack(at date: Date = .now) {
        guard currentStepIndex > 0 else { return }
        currentStepIndex -= 1
        resetStep(at: date)
    }

    func finish() { isFinished = true }

    private func resetStep(at date: Date) {
        stepStartedAt = date
        remainingSeconds = Int(currentStep.duration)
        pausedSeconds = nil
        isPaused = false
    }
}
```

- [ ] **Step 4: Run the full session test suite**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15' -only-testing:SpineFlowTests/PracticeSessionTests`

Expected: `TEST SUCCEEDED`.

- [ ] **Step 5: Commit session behavior**

```bash
git add SpineFlow/Features/Session/PracticeSession.swift SpineFlowTests/PracticeSessionTests.swift
git commit -m "Добавил таймер и управление практикой"
```

### Task 5: Build the SwiftUI screens and safety notice

**Files:**
- Create: `SpineFlow/Design/SpineTheme.swift`
- Create: `SpineFlow/Features/Home/HomeView.swift`
- Create: `SpineFlow/Features/Home/PracticeCardView.swift`
- Create: `SpineFlow/Features/Practice/PracticeView.swift`
- Create: `SpineFlow/Features/Practice/PracticeStepView.swift`
- Create: `SpineFlow/Features/Completion/CompletionView.swift`
- Create: `SpineFlow/Features/Safety/SafetyNoticeView.swift`
- Modify: `SpineFlow/SpineFlowApp.swift`

**Interfaces:**
- Consumes: catalog, session, progress store, and models from Tasks 1-4.
- Produces: complete visual flow from the home screen through completion.

- [ ] **Step 1: Define visual tokens**

Create `SpineTheme` with a light background, a warm green accent, a muted coral accent, an 8-point spacing scale, and semantic fonts using `Font.system`. Keep contrast readable and do not use gradients.

- [ ] **Step 2: Implement the one-time safety notice**

Show a sheet before the first practice. It must state: “Spine Flow помогает сделать мягкую практику после рабочего дня и не заменяет консультацию специалиста. При боли, травме или ухудшении самочувствия прекратите занятие.” Persist acknowledgement with the Boolean key `hasAcknowledgedSafetyNotice`.

- [ ] **Step 3: Implement the home screen**

Use a `NavigationStack`. Show a “Сегодня” section with `PracticeCatalog.recommended`, then a “Все практики” section with the remaining catalog. Each `PracticeCardView` shows a practice title, total duration formatted as minutes, subtitle and an optional “Последняя практика” label when it matches `UserProgress.lastPracticeID`.

- [ ] **Step 4: Implement the practice and completion screens**

`PracticeView` owns a `PracticeSession`, updates it once per second with a `TimelineView`, pauses and resumes it using `scenePhase`, and displays buttons for previous step, pause/resume and next step. `PracticeStepView` displays a clean line-art placeholder constructed from SF Symbols and text; it must not require bitmap assets. When `session.isFinished` becomes true, navigate to `CompletionView`. `CompletionView` calls `ProgressStore.recordCompletion` once and returns to the root home screen.

- [ ] **Step 5: Run the application in an iPhone simulator**

Run: `xcodebuild build -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15'`

Expected: `BUILD SUCCEEDED`.

- [ ] **Step 6: Commit the user interface**

```bash
git add SpineFlow
git commit -m "Собрал основной интерфейс и путь прохождения практики"
```

### Task 6: Add end-to-end UI coverage and quality checks

**Files:**
- Create: `SpineFlowUITests/SpineFlowUITests.swift`
- Modify: `SpineFlow/Features/Home/HomeView.swift`
- Modify: `SpineFlow/Features/Practice/PracticeView.swift`
- Modify: `SpineFlow/Features/Completion/CompletionView.swift`

**Interfaces:**
- Consumes: accessibility identifiers from the SwiftUI views.
- Produces: repeatable primary-flow UI test.

- [ ] **Step 1: Add accessibility identifiers**

Assign the identifiers `safety-continue`, `practice-neck`, `practice-next`, and `completion-done` to the corresponding controls. Do not use visible English copy as an identifier substitute.

- [ ] **Step 2: Write the end-to-end test**

```swift
import XCTest

final class SpineFlowUITests: XCTestCase {
    func testUserCanCompleteTheNeckPractice() {
        let app = XCUIApplication()
        app.launchArguments = ["-resetProgress", "YES"]
        app.launch()

        if app.buttons["safety-continue"].exists {
            app.buttons["safety-continue"].tap()
        }

        app.buttons["practice-neck"].tap()
        while app.buttons["practice-next"].exists {
            app.buttons["practice-next"].tap()
        }
        app.buttons["completion-done"].tap()

        XCTAssertTrue(app.staticTexts["Сегодня"].exists)
    }
}
```

- [ ] **Step 3: Run all tests**

Run: `xcodebuild test -scheme SpineFlow -destination 'platform=iOS Simulator,name=iPhone 15'`

Expected: `TEST SUCCEEDED`.

- [ ] **Step 4: Perform manual simulator checks**

Verify the safety notice, all five practice cards, pause/resume, backward navigation, foreground return, completion progress and offline launch. Test in iPhone SE (3rd generation) and iPhone 15 simulators to catch small-screen layout issues.

- [ ] **Step 5: Commit the test coverage**

```bash
git add SpineFlow SpineFlowUITests
git commit -m "Покрыл основной пользовательский путь UI-тестом"
```

### Task 7: Prepare the release-ready project metadata

**Files:**
- Modify: `SpineFlow.xcodeproj/project.pbxproj`
- Create: `docs/release/app-store-checklist.md`

**Interfaces:**
- Consumes: the completed app and final application identifier supplied by the owner.
- Produces: locally documented release checklist; no App Store Connect upload occurs in this task.

- [ ] **Step 1: Set final local metadata**

Set the display name to `Spine Flow`, configure an empty analytics footprint, keep the minimum deployment target at iOS 17, and use Xcode 26 or newer with the iOS 26 SDK for the release build. Do not create an App Store Connect record, upload a build, or publish without explicit user authorization.

- [ ] **Step 2: Write the release checklist**

Include checks for real-device smoke testing, final Russian screenshots, store description without medical claims, app privacy answers matching the no-network/no-analytics design, App Store review notes for the safety notice, and final owner-controlled Apple Developer/App Store Connect actions.

- [ ] **Step 3: Verify an archive locally on macOS**

Run: `xcodebuild archive -scheme SpineFlow -configuration Release -archivePath build/SpineFlow.xcarchive`

Expected: `ARCHIVE SUCCEEDED`. This step requires a Mac with Xcode; it cannot be run in the current Windows-only environment.

- [ ] **Step 4: Commit release documentation**

```bash
git add SpineFlow.xcodeproj docs/release/app-store-checklist.md
git commit -m "Подготовил проект к проверке перед публикацией"
```

## Plan Self-Review

- Spec coverage: Tasks 1-6 implement the offline Russian SwiftUI MVP, five-practice catalog, local progress, timer behavior, safety notice, UX flow and automated checks. Task 7 records the release preparation boundary.
- Scope: no task introduces backend, payments, subscriptions, accounts, video, notifications or medical claims.
- Test coverage: unit tests cover catalog, persistence and session state; the UI test covers the primary path; manual checks cover foreground return, device layouts and offline launch.
- Execution constraint: actual iOS build, simulator and archive commands require macOS with Xcode. The current Windows workspace can host documentation and source files but cannot perform those Apple toolchain checks.
