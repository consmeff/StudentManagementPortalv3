## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

Clean Code Principles
1.	Meaningful Names:
○	Use clear and descriptive variable, function, and component names
○	Avoid abbreviations and shortcuts (e.g., avoid dashSvc, let l, let tOps)
○	A good code should describe itself with meanignful names and functions - don't add comments unless it is heavy logic (and it’s advisable that you have a peer review with a colleague on that)
2.	Avoid Magic Numbers/Strings:
○	Use constants for all hard-coded numbers and strings
○	Constants must stay in a central constants folder in the codebase with each constant file bearing a name corresponding to its component (e.g. dashboard.constants.ts)
3.	No Comments for Clarification:
○	Replace explanatory comments with well-named functions
4.	No TODOs in Code:
○	Do not leave TODO comments; instead, create a ticket in Linear for follow-up takss
5.	Do not leave commented-out code
○	Commented-out code clutters files, creates confusion, and can become outdated. Use version control (Git) to retrieve old code if needed, and keep comments (again, only when needs arrises) only for explanations, not for disabling code. Delete dead code instead of leaving it commented
○	Write documentation for complex reusable components in a Docs folder (with each file having a name correspondnig to its component)
6.	Boy Scout Rule:
○	If you encounter small issues that are easy to fix, address them immediatley
○	If you encounter a challenging issue, report it as early as possible
7.	Component/Function Division:
○	Ensure meaningful separation of components and functions for clarity and maintainability.
8.	No Duplicate Code:
○	Avoid redundancy and duplication in code. Duplication is a critical issue.
9.	Init variables with null instead of undefined
10.	Use === and not ==
11.	Prefer using ?? rather than || when dealing with null / undefined
12.	Init variables at the top of the file.
13.	If interface has only properties, use type instead, and have the interfaces/types in a folder naming them after thier module/component.
14.	Use HttpStatusCode for http status, and not magic number.
15.	Type Usage:
○	Don’t use any.
○	Don’t use enum, instead create object, and a type for it:
 
○	Use clear type names (e.g., use Metric instead of TMetric).
○	Use ‘hello’ as Type rather than <Type>’hello’ (cast only in rare cases)
○	Generic types should be expressive, and prefixed with T. 
for example: TData instead of T or D
Does and Don’ts Examples:
Don't use raw template (scss, html), export to file
 
Use constructor injection for classes (components, services, directives).
Use inject() only in functional or non-class contexts.
 
Don't Inline style, Use classes or Tailwind.
 
Don't add filename as a comment
 
Clear component division
 
no need to specify it's a list in the name, ACCOUNT_METRICS is enough
 

Const should be in a const file, as well as types should be in a types file.
 

properties should be on on the top, not the bottom

Make any function/component that could be reused a reusable function/component (eg. tables, button, cards, modals etc. or helper functions)

Always take note of the principles; separation of concern, DRY or SOLID principle
Dont use enum, enums are not recommended in typescript, use const instead.
Never use setters or getters as it might cause unnecessary re-renders
Always use signals instead of Emitters/behavior subject in Angular projects (or replace with sigal-based codes)
Dont create magic number, create a config const object

Make sure alignment to figma with the smallest details 

Make sure Mobile works in small mobile screen: 

'v ?? ''' format will use Object's default stringification format ('[object Object]') when stringified.

Refactor function to reduce its Cognitive Complexity to 15 allowed.

Extract nested ternary operation into an independent statement.

Mark the props of component as read-only.

Avoid Unnecessary use of conditional expression for default assignment.

A form label must be associated with a control.

Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.

Visible, non-interactive elements with click handlers must have at least one keyboard listener.

Remove unused import

Remove useless assignment to variable

Prefer `globalThis` over `window`.
Don't use any getters or setters in the component.
 don't use async where subscribe/observables is needed.
Handle this exception or don't catch it at all.

Fix any Unknown property 'stroke-width' found, use 'strokeWidth' instead

Fix any Unknown property 'stroke-linecap' found, use 'strokeLinecap' instead

Fix any Unknown property 'stroke-linejoin' found, use 'strokeLinejoin' instead

Fix any Unknown property 'stroke-width' found, use 'strokeWidth' instead

Fix any conditional operation that returns the same value whether the condition is "true" or "false".

Move component definition out of the parent component and pass data as props.
