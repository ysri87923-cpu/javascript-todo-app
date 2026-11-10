# TaskFlow — JavaScript To-Do List

A responsive, client-side task manager built with HTML, CSS and vanilla JavaScript.

## Features

- **Create:** Add new tasks.
- **Read:** Display all saved tasks.
- **Update:** Edit task names and mark tasks as completed or active.
- **Delete:** Remove individual tasks.
- **Filtering:** View All, Active or Completed tasks.
- **Persistence:** Automatically save tasks in `window.localStorage`.
- **Event delegation:** Handle task edit/delete actions from the task list.
- **Summary:** Display total, active and completed task counts.
- **Responsive layout:** Works on desktop, tablet and mobile screens.

## Run locally

1. Download or clone this repository.
2. Open the folder in VS Code.
3. Open `index.html` in a browser, or use the Live Server extension.

No frameworks, packages or build tools are required.

## How data persistence works

Tasks are stored in the browser under the key `taskflow-tasks`. The app reads this value when it starts and updates it after each task change. Data remains in that browser's local storage until the browser data is cleared.

## GitHub Pages

1. Create a public GitHub repository.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

The app will be published at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Technologies

HTML5 · CSS3 · JavaScript · DOM Manipulation · Event Handling · localStorage
