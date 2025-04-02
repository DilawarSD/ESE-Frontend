# ESE-Frontend

Installation:
- git clone repo
- cd ese-frontend
- npm install

- configure environment variables: 
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CSRF_SECRET=your_csrf_secret

- npm run dev to run the application 
- npm test to be able to run the unit tests 

## Introduction 
This is a full-stack task management system which is built with Next.js react for frontend and supabase for backend. The application features a Kanban board interface for visualising workflow, user authencation for login and real-time taks management capabilities. 

## Project Aim & Objectives
The main goal is to create a secure, scalable task management platform which enhances team productivity. 
Key objectives:
1. Implement secure user authentication and authorisation such as using supabase to be able to sign in and sign up. 
2. Create a intuitive Kanban board interface for task visualisation which include search and sort functionality, drag and drop of the tickets moving and edit or delete tickets. 
3. Provide user assignee to tasks
4. Addng security and error handling

## Enterprise considerations

Performace:
- Optimised API that is able to efficiently fetch data in faster response.

Scalabilty:
- Implemented a clean separation between frontend,middleware(API) and backend into two separate repos.

Robustness
- Implemented try and catch on all my GET,POST,PUT and DELETE methods to ensure that the data is fetched from the backend and if not to provide an error to display that it hasn't.
- Providing meaningful error messages to help users to understand what needs to be filled in providing user friendlynss to the app.
- Error handling to all API routes

Security
- Implemented CSRF protection on all methods
- Applied comprehensive content security policy headers to help prevent vulnarbilities to occur on the app
- Secured authentication using supabase authentication which includes JWT and password hashing that is included in supabase.
- Add input validations for all user inputs for creating a ticket, adding users and making sure the email is written in the correct format

Deployment 
- Deployed the Kanban application on Render
- Use the enviroment variables for secure management and being able to deploy safelt
- Implemented security headers for production


## Feature overview 

User Authentication
- The purpose of this is to make sure we have a secure login, registration. This is by when signing up an email will be sent by supabase for you to accept to which will allow you to sign in with the same email and password.
- This can be found in my src/app/components/Sign.js file
- Main compoment for this file is a authentication form that needs to be filled in by entering an email and password and a supabase auth intergratin that connects to the supabase organisation as a user that can sign.

Kanban board
- 

## Future improvements
For future improvements there are few things that I can improve/enhance which are:
1. Create user roles so all users that have access to the board can onlt view users and not add, edit or delete them. Only the manager can add,edit and delete users.
2. Adding filtering and search functionality to help find tickets or user much easier. 
