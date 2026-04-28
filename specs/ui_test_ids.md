# UI Test IDs Requirements

To ensure robust and maintainable E2E tests, the following `data-testid` attributes must be added to the source code components.

## Exam Container & Navigation
These should be implemented in the main exam layouts.

| Element | Description | data-testid | Target File(s) |
|---------|-------------|-------------|----------------|
| Exercise Card | The main container for the current question | `exercise-card` | `src/app/student/(full)/arena-exam/[arenaId]/page.tsx`<br>`src/app/student/(full)/entrance-test/page.tsx` |
| Next Button | Button to go to the next question ("Câu sau") | `next-question-btn` | `src/app/student/(full)/arena-exam/[arenaId]/page.tsx`<br>`src/app/student/(full)/entrance-test/page.tsx` |
| Previous Button | Button to go to the previous question ("Câu trước") | `prev-question-btn` | `src/app/student/(full)/arena-exam/[arenaId]/page.tsx`<br>`src/app/student/(full)/entrance-test/page.tsx` |
| Submit Button | Main submit button ("NỘP BÀI") | `submit-exam-btn` | `src/app/student/(full)/arena-exam/[arenaId]/page.tsx`<br>`src/app/student/(full)/entrance-test/page.tsx` |
| Exit Button | Exit button ("Thoát") | `exit-exam-btn` | `src/app/student/(full)/arena-exam/[arenaId]/page.tsx`<br>`src/app/student/(full)/entrance-test/page.tsx` |

## Exercise Components
These should be implemented in the respective components within `src/components/ExerciseWebUI`.

### MultipleChoice.tsx
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| Option | Each individual choice option | `choice-option` | `src/components/ExerciseWebUI/MultipleChoice.tsx` |

### TrueFalse.tsx
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| True Button | The "Đúng" selection button | `true-option` | `src/components/ExerciseWebUI/TrueFalse.tsx` |
| False Button | The "Sai" selection button | `false-option` | `src/components/ExerciseWebUI/TrueFalse.tsx` |

### FillIn.tsx
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| Input | Each text input field for filling | `fill-in-input` | `src/components/ExerciseWebUI/FillIn.tsx` |

### Matching.tsx
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| Left Column | Container for the left items | `matching-left-col` | `src/components/ExerciseWebUI/Matching.tsx` |
| Right Column | Container for the right items | `matching-right-col` | `src/components/ExerciseWebUI/Matching.tsx` |
| Matching Item | Individual item in either column | `matching-item` | `src/components/ExerciseWebUI/Matching.tsx` |

### Interactive.tsx
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| Option | Source option for dragging/clicking | `interactive-option` | `src/components/ExerciseWebUI/Interactive.tsx` |
| Blank | Destination blank in the sentence | `interactive-blank` | `src/components/ExerciseWebUI/Interactive.tsx` |

## Home Page
| Element | Description | data-testid | Target File |
|---------|-------------|-------------|-------------|
| Assessment Float | Floating flask button for entrance test | `assessment-float-btn` | `src/app/student/(main)/home/page.tsx` |

