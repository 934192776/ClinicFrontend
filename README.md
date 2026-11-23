# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Project Overview
This is the frontend of a Clinic Appointment Booking application. It allows patients to search for available appointments, book/reschedule/cancel appointments, and view booking details. The frontend is built with React and integrates with a REST API backend.

Purpose of this repository: practice project for frontend development and QA testing, including manual test case execution, API validation with Postman, and basic Playwright smoke tests.

Tech Stack
React.js

JavaScript (ES6+)

HTML5 / CSS3

REST API integration

Create React App (CRA)

Git / GitHub

Features
Search available appointments

Book an appointment

View appointment details

Reschedule / cancel appointment

Form validation and error handling

Loading and error states for API requests

Responsive layout

How to Run Locally
Prerequisites
Node.js (v18+ recommended)

npm

Steps
bash
# 1. Clone the repository
git clone
cd clinicapp/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
Open http://localhost:3000 in your browser.

Environment Variables
If the frontend needs a backend API URL, create a .env file:

env
REACT_APP_API_BASE_URL=<your-backend-api-url>
Do not commit real credentials or secrets.

Backend
This frontend expects the backend API to be running.


Testing & QA Practice
This project was also used for QA practice:

Wrote and executed manual test cases for booking, validation, and error states

Used Postman to validate appointment-related REST API endpoints (status codes, response body, invalid input)

Wrote basic Playwright smoke/E2E scripts

Logged structured bug reports with steps to reproduce, expected vs actual results, severity and evidence

Known Limitations
1. no authentication/role-based access yet

2. limited mobile responsiveness on some pages

3. uses mock/test data; not production-ready

4. no automated CI pipeline yet

Task Design Example
Task: Fix the loading and error state handling on the appointment search page.

Context: When the user searches for appointments, the app shows a loading indicator while the API request is in progress. If the request fails, it shows a clear error message and allow the user to retry.

Expected behavior:

While the API request is in progress, a loading indicator is displayed.

If the request succeeds, appointment results are displayed.

If the request fails, an error message is shown.

The user can retry the request and recover without refreshing the page.

No console errors during any of the above states.

Success criteria:

All three states (loading / success / error) can be reproduced manually.

Retry works and returns to success state when the API recovers.

No unhandled promise rejection or console error.

Layout remains responsive on desktop and mobile widths.

Verification steps:

Run npm start and open the appointment search page.

Throttle network or mock API failure to trigger error state.

Confirm loading indicator appears during request.

Confirm error message appears on failure.

Click retry and confirm results load when API succeeds.

Check browser console for errors.


What I Learned / What I Would Improve
1. improve state management for loading/error states

2. add automated tests with basic Playwright and run them in CI
