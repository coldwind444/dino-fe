# Dino Math

## Overview
Dino Math is an educational web application for elementary students to practice Logical Math Thinking. The website focused on providing children with gamified interactive exercises and Math minigames.

## Features
### Authentication & Security

#### 1. Roles
##### a. Parents
* Parents can log in to the website using Dino Math account (email and password) or Google Account. 
* When parents create new account, the system automatically creates a family that is assigned to them. 
* They will be provided with a family invite code which will be used to add their children (students) to the family in the future.
##### b. Students
* Students can only log in to the website using Dino Math account (username and password). 
* When the students log in for the first time, they will be requested to fill in some personal information (full name, grade, avatar). Especially, they must enter the family invite code (provided by their parents) to be added to the family. 
* Without the family invite code, they will not be allowed to use Dino Math.

#### 2. Change/Recover password
* Parents and Students will share the same process to change or recover their password. 
* For recovering, they need to enter their username (for students) or email (for parent); then an email with 6-digit OTP will be sent to the parents' mailbox.
* Parents and Students must use that OTP to change/recover their password.
* For changing password, the identifier confirm step (enter username or email) will be skipped.

#### 3. Pages access
* Students and Parents can only access the pages they are allowed to.
* If users try to access pages that they do not have permission, the web will redirect them back to their site.
* If users try to access protected pages or proceed authorization required actions without authentication, they will be redirected back to login page.

### Practice with gamified exercises (Students)
* At home page, students can select grade (1-5) they want to study by clicking on the numbered button. By default, the button with number matches their grade (original information in profile) will be selected.
* After selecting grade, they will see their recent topics and complete topics for that grade.
* Students can navigate to topics page to see all topics of that grade.
* After clicking on a topic card, they will be redirected to milestones page. Each milestone will be a lesson. Choose 1 lesson to learn. In that lesson, they can view theory content or do gamified exercises.
* 