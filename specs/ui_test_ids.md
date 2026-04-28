# UI Test IDs Requirements

To ensure robust and maintainable E2E tests, the following `data-testid` attributes must be added to the source code components.

## Exam Container & Navigation
These should be implemented in `ArenaExam` and `EntranceTest` pages.

| Element | Description | data-testid |
|---------|-------------|-------------|
| Exercise Card | The main container for the current question | `exercise-card` |
| Next Button | Button to go to the next question ("Câu sau") | `next-question-btn` |
| Previous Button | Button to go to the previous question ("Câu trước") | `prev-question-btn` |
| Submit Button | Main submit button ("NỘP BÀI") | `submit-exam-btn` |
| Exit Button | Exit button ("Thoát") | `exit-exam-btn` |

## Exercise Components
These should be implemented in the respective components within `src/components/ExerciseWebUI`.

### MultipleChoice.tsx
| Element | Description | data-testid |
|---------|-------------|-------------|
| Option | Each individual choice option | `choice-option` |

### TrueFalse.tsx
| Element | Description | data-testid |
|---------|-------------|-------------|
| True Button | The "Đúng" selection button | `true-option` |
| False Button | The "Sai" selection button | `false-option` |

### FillIn.tsx
| Element | Description | data-testid |
|---------|-------------|-------------|
| Input | Each text input field for filling | `fill-in-input` |

### Matching.tsx
| Element | Description | data-testid |
|---------|-------------|-------------|
| Left Column | Container for the left items | `matching-left-col` |
| Right Column | Container for the right items | `matching-right-col` |
| Matching Item | Individual item in either column | `matching-item` |

### Interactive.tsx
| Element | Description | data-testid |
|---------|-------------|-------------|
| Option | Source option for dragging/clicking | `interactive-option` |
| Blank | Destination blank in the sentence | `interactive-blank` |

## Home Page
| Element | Description | data-testid |
|---------|-------------|-------------|
| Assessment Float | Floating flask button for entrance test | `assessment-float-btn` |
