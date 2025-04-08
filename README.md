# ESE-Frontend

## Introduction 
This is a full-stack task management system which is built with Next.js and React.js for frontend and supabase for backend. The application is aimed at managers providing access to a kanban board to be able to create, add,edit and delete tickets and assign either themselves or other users to the tickets. Also being able to add,edit and delete users.  

## Project Aim & Objectives
The main goal is to create a secure, scalable task management platform which enhances team productivity. 
Key objectives:
1. Implement secure user authentication and authorisation such as using supabase to be able to sign in and sign up. 
2. Create a intuitive Kanban board interface for task visualisation which include search and sort functionality, drag and drop of the tickets moving and edit or delete tickets.
3. Implemented a search and sort functionality for searching for users or tickets. 
4. Assigning users to tasks
5. Adding security and error handling. For security I implemented CSRF tokens, user authentication and CSP headers. Error handling try and catch errors for the api connections to backend through the middleware and for error handling having validation in place for the users to understand what needs to be filled in such as if you are adding a user details need to fill in all of the user details in order to add a user to the application. 

## Enterprise considerations

Performace:
- Optimised API that is able to efficiently fetch data in faster response. When adding data good performance is showcased how quick it is able add the data and preventing a refresh from appearing on the app.

Scalabilty:
- Implemented a clean separation between frontend, middleware(API) and backend into two separate repos.
- Application making sure when adding data it doesn't slow down the application and the application response stays the same. 

Robustness
- Implemented try and catch on all my GET,POST,PUT and DELETE methods to ensure that the data is fetched from the backend and if not to provide an error to display that it hasn't.
- Providing meaningful error messages to help users to understand what needs to be filled in providing user friendliness to the app.


Security
- Implemented CSRF protection on all methods.
- Applied comprehensive content security policy headers to help prevent vulnerabilities to occur on the app
- Secured authentication using supabase authentication which includes JWT and password hashing that is included in supabase.
-  Add input validation for creating tickets, adding users, and ensuring the email format is correct.
- protecting unauthorised access by making sure it prevents access unless they are signed in.
- Preventing my env from being exposed showcasing the values that will allow access to the application. Adding env to gitignore protects the envs from being shown on the frontend repo for the public to see. 

Deployment 
- Deployed the Kanban application on Render.
- Use the environment variables for secure management and being able to deploy safely.
- Implemented security headers for production such as csrf tokens being applied and csp headers being applied.

## Installation:
- node.js needs to be installed
- git clone repo
- cd ese-frontend
- npm install

- Configure this to your environment variables:

NEXT_PUBLIC_SUPABASE_URL=https://krgmdbikoraoeiuodjtx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZ21kYmlrb3Jhb2VpdW9kanR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODEwMzIsImV4cCI6MjA1NzM1NzAzMn0.q03sXiGl7ce3OhVVLMQNcmhmlw0kl4AIM8SomNUd-OY

CSRF_SECRET=ghsysbhdsb

- npm run dev to run the application 
- npm test to run the unit tests

Backend repo ese-backend 
- just need to do npm install as supabase is always running so no need for any commands to be running. 

## Feature overview 

User Authentication
- The purpose of this is to make sure we have a secure login, registration. This is by when signing up an email will be sent by supabase for you to accept to which will allow you to sign in with the same email and password.
- This can be found in my src/app/components/Sign.js file.
- Main component for this file is a authentication form that needs to be filled in by entering an email and password and a supabase auth intergrating that connects to the supabase organisation that is able to sign in.
- In this sign.js component I use another component within this file called supabaseClient.js which is located in my lib folder which makes the connection to sign up with supabase.  

Kanban board
- The purpose of the kanban board is to display the tickets in the correct column.
- Editing tickets such as assigning to different user or updating the overall ticket itself and deleting tickets.
- Implemented validation to display an error if the title of the ticket is not added.
- Drag and drop functionality to be able to move tickets across the board.
- This can be located in my codebase by going through src/app/components/KanbanBoard.js.

Within this KanbanBoard.js component I have other components that are being used in this file which are:
  1. KanbanColumn.js- Displays the columns for the kanban board.(Ready, in progress and done).
  2. DropAndDrag.js- Dragging and dropping tickets into any of the columns in the kanban board.
  3. TicketForm.js- Allowing users of the application to input the title and description of the ticket and assigning users.
  4. Server.js- This is my server.js file where it is able to getTickets to able to display the tickets, updateTickets as for the kanban board you have the ability to update the ticket that are created, deleteTickets which is deleting the tickets that are created and getUsers to display users who are assigned to the tickets. This file connects to the supabase database through the API folder, which contains the ticket and user routes, enabling these actions.
  

Backlog 
- Adding, editing and deleting tickets.
- Assign tickets to users.
- Displays the created tickets.
- Implemented validation to display an error if the title of the ticket is not added.
- Search and sort functionality being implemented. Search functionality allows managers to search for the tickets that are created and the sort functionality is sorting by status such as from 'Ready', 'In Progress' to 'Done' or 'Done', 'In progress' to 'Ready'. Also sorting by title of the ticket being in alphabetically order from A-Z or Z-A.
- This can be located in my codebase by going thorough src/app/components/Backlog.js.

Within this Backlog.js component I have other components that are being used in this file which are:
  1. BacklogForm.js - This where you are able to input to create a ticket.
  2. BacklogList.js - This displays the tickets where you have the buttons displayed with edit and delete.
  3. ticketUtils.js - This is a utils file that has sort and search functionality.
  4. Search.js -displays the search bar and sort options.
  5. Server.js -This is my server.js where it is able to make the actions of getTickets to where we can display the tickets, addTicket which is where we can add the tickets, updateTickets and deleteTickets where you can edit or delete tickets that were created and getUsers which is to display the users.  This file connects to the supabase database through the API folder, which contains the ticket and user routes, enabling these actions. 

User 
- Displaying users in a list.
- Adding, editing and deleting users.
- Implemented validation to display and error that all the user details need to be filled in before adding or updating users.
- Implemented a search and sort functionality. Search functionality allows managers to search for users and the sort functionality is to be able to sort by alphabetically order from either A-Z or Z-A for the users first name,last name and email.
- This can be located in my codebase by going through src/app/components/User.js.

Within this User.js component I have other components being used in this file which are:
  1. UserForm.js- This file is where you are to input to add users.
  2. UserList.js- This is to display the users that have be added where you can we have the edit and delete buttons being present.
  3. Search.js-displays the search bar to search for users and sort options for first name, last name and email.
  4. userUtils.js- This is a utils file where it has the sort and search functionality.
  5. Server.js- This is my server.js where it is able to getUsers to be able to display the users from my supabase database, addUser to be able to add users to the database, updateUser and deleteUser to be able to edit users details or delete users from the database. This file connects to the supabase database through the API folder, which contains the user routes, enabling these actions. 


## Future improvements
For future improvements there are few things that I can improve/enhance which are:
1. Create user roles so all users that have access to the board can only view users and not add, edit or delete them. Only the manager can add, edit and delete users. So having a new board to where both boards share the same database but one will be for users that will prevent them having all the features of the app and can only view the users not allowing them to edit of delete them. Whereas, for managers the application I built will have access to all the features being available for them. 

