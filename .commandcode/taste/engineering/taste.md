## Coding Style
- Prefers component/form code to stay consistent with existing patterns elsewhere in the codebase rather than introducing divergent ones (e.g., inline error state + message like BookingSection/login instead of a separate modal/alert). Confidence: 0.8
- Prefers custom validation messages over native browser validation, disabling the latter with `noValidate` so custom inline errors (not "Please fill out this field") are shown. Confidence: 0.7
- Prefers required form fields to be genuinely enforced and start empty, rather than carrying a silent default value that lets users skip them (e.g., replaced the "Hamba Allah" default donor name with an empty string so an empty name is caught by validation). Confidence: 0.7
