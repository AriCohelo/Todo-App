# Claude Development Workflow Rules

## Core Development Process

1. **Think and Plan First**

   - Think through the problem thoroughly
   - Read the codebase for relevant files
   - Write a detailed plan to `tasks/todo.md`

2. **Create Checkable Todo Items**

   - The plan should have a list of todo items that can be checked off as completed
   - Each item should be specific and actionable

3. **Get Approval Before Starting**

   - Before beginning work, check in with the user
   - User will verify the plan before proceeding

4. **Execute and Track Progress**

   - Work on todo items systematically
   - Mark items as complete as you go
   - Update progress in real-time

5. **Provide High-Level Updates**

   - Give high-level explanations of changes made at each step
   - Focus on what was accomplished, not implementation details

6. **Simplicity Above All**

   - Make every task and code change as simple as possible
   - Avoid massive or complex changes
   - Every change should impact as little code as possible
   - Everything is about simplicity

7. **Document and Review**

   - Add a review section to the `todo.md` file
   - Include summary of changes made
   - Add any other relevant information

8. **Test-Driven Development (TDD)**

   - Always work with tests first before implementation
   - Write failing tests, then make them pass

9. **Vertical Slice Development**

   - Develop a feature completely before starting another feature
   - Focus on end-to-end completion of functionality
   - Avoid partial implementations across multiple features

10. **No co-authoring**

- I don't need co-autoring yuor name in commit messages, so dont add it.

11. **English grammar correction**

- If applies, on the beggining of every response correct my english grammar and ortography if applies1

## Memories and Reminders

- Remember that Context API is a thing I never had use so later I would need to explain me what are we going to do in this session in where we are gonna fix the prop drilling
- Never suggest commit messages including double quotes "

- Color Picker Implementation Memory:
  - Used a state variable to manage the selected color
  - Created an input of type "color" to allow direct color selection
  - Implemented an onChange handler to update the color state when a new color is picked
  - Passed the selected color to the relevant component/state for styling or task categorization
  - Ensured the color picker integrates smoothly with the existing todo item creation/editing flow
- Remember this talk and remind me the next session to do this change, change oncardclick to live in the todoCArd component sinces its mostly used to hanlde todocard bussiness
