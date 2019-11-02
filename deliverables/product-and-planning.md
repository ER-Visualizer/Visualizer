# ED-Simulation/ED-Simulation-VI
> _Note:_ This document is meant to evolve throughout the planning phase of your project.    
 > That is, it makes sense for you commit regularly to this file while working on the project (especially edits/additions/deletions to the _Highlights_ section).
 > Most importantly, it is a reflection of all the planning you work you've done in the first iteration. 
 > **This document will serve as an agreement between your team and your partner.**

## Product Details
 
#### Q1: What are you planning to build?

Our product is an application that will simulate patient trajectory through an emergency department. 

The ED simulation will enable researchers to quickly see how changes to the ED (such as the # of doctors, and how patients are moved from doctor to doctor) result in different patient experiences and ultimately allow researchers to develop a better experience for hospital patients. For example, a hospital dealing with long wait times, will use the simulation to develop a new ED patient trajectory to reduce patient wait times. 

![Diagram 1](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/d1/Diagram1.png)

![Diagram 2](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/d1/Diagram2.png)


#### Q2: Who are your target users?

- Researchers with some computational experience.

- Hospital Management staff looking to improve the ER workflow.

- Doctors in hospitals.

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Users would choose our product because it enables them to study the effect of different settings of the ED. Users will be able to observe things that can be difficult to identify without software, such as bottlenecks in the system. Based on the output, the hospital staff can make informed decisions on how they can make improvements to patient experience and hospital efficiency. For example, in the case of an identified bottleneck, hospital staff can choose to allocate more resources into a particular section of the hospital in order to alleviate the bottleneck and streamline patient care.

The simulations can accept a large number of parameters and will provide helpful visualizations to improve ease of use. Users would also be able to simulate different scenarios depending on what action is taken. While other simulators already exist, they do not offer the full freedom required for exploring alternative scenarios under different conditions. This makes our product superior since our simulations will cover a broader range of possibilities, which will benefit the hospital’s goal to effectively treat as many patients as possible.
Furthermore, our product will be a web application. This increases the accessibility and ease of use for users. Being a web application means that our product can be accessible from a widely increased range of devices. 


#### Q4: How will you build it?

We will build the architecture in Python, with a class-based structure where processes and queues are all classes which communicate with each other.

Our initial plan is to use Flask for the backend and React for the frontend. For visualizations we are thinking of using d3.js or vis.gl. We will use numpy and pandas to manipulate the CSV. 

The application will be deployed with a docker image that the Vector Institute researcher can run.

We are following a strategy of continuous deployment. Before any branch is merged into master, a series of tests will be run against the branch to ensure that it is functioning. Additionally, everyone is responsible for writing unit tests for their code. Finally, to test usability we will demo the app to the Vector institute periodically to get feedback on how the app could be improved. 


#### Q5: What are the user stories that make up the MVP?

As a researcher tasked with improving the distribution of resources in a hospital, I want to be able to set my own parameters to simulate a hypothetical workflow and present potential improvements from my results.

As a hospital manager who wants to improve wait times, I want to be able to see a list of bottlenecks in the current system so that I can make informed decisions on how to optimize wait time (e.g. by adding/redirecting resources).

As a hospital staff that is being presented with the simulated results, I want to see how patients are moving in a visual model that is intuitive and easy to understand.

As a hospital staff responsible for managing finances, I want to find the most expensive resource we can get rid of (in the event of budget cuts) without significantly reducing the efficiency of the workflow.

----

## Process Details



#### Roles & responsibilities
**Roles**

Organizer/Lead
 * Sets deadlines for tasks
 * Organizes meetings
 * Makes sure that everyone is completing their tasks on time
 
Product Manager
 * Talks with the Vector Institute and other stakeholders to determine what should be developed
 * Creates specification documents detailing what should be built
 * Sets tasks based on the specification document
 
Designer
 * Designs the user interface to make it look good
 * Tests the user interface on clients to ensure that it is usable
 
Frontend developer
 * Codes the visualization using front-end frameworks such as React
 * Works with the PM(s) and backend developer(s) to develop the product
 
Backend Developer
 * Codes the algorithm behind the visualizations through a backend server
 * Works with the PM(s) and frontend developers(s) to develop the product
 
**Responsiblities**

Simran:
 * Description: Responsible for coding the backend server and the frontend user interface. Is also responsible for organizing meetings and delegating tasks to people. 
 * Strengths: Typescript, Flask, continuous deployment, software architecture  
 * Weaknesses: Indecisive, time, spelling
    
Daniel:
 * Description: Primarily responsible for backend development but can switch to frontend if more attention is required.
 * Strengths: Python, Javascript (currently learning react)
 * Weaknesses: Indecisive, project planning, knowledge of libraries and architectures
    
Wenqin:
 * Description: Responsible for frontend development and backend development, but with a focus on the frontend aspect. Additionally responsible for designing the user interface and testing the products’ final usability.
 * Strengths: Frontend development, design, problem solving
 * Weaknesses: Organization, time management, prioritization 
    
Mit:
 * Description: Responsible for backend development primarily with some involvement in frontend development.
 * Strengths: Python, large-scale projects, Django, software design, JavaScript
 * Weaknesses: Time management, organization, excessively detail-oriented
    
Carlson:
 * Description: Experienced with developing various applications and is responsible for handling issues and reviews. 
 * Strengths: NLP, Javascript, Fullstack Development, APIs
 * Weaknesses: Availability, organization
    
Victor: 
 * Description: Responsible for mocking up designs and front end development. 
 * Strengths: Python, Python Libraries, ML
 * Weaknesses: Web libraries, linear algebra, design methodologies
    
Nicolae:
 * Description: System architecture, APIs
 * Strengths: Python, Flask, software architecture, JavaScript.
 * Weaknesses: React

#### Team Rules

Our team has a relaxed and fun working culture. Everyone has their own schedule and time when they work best, so we do not care when someone works, as long as they finish their part by the agreed upon deadline. In addition, we are supportive of each other. We will try our best to help each other if anyone has questions or needs help. 

Communications:
 * In person meetings on Tuesday between 4-6pm to discuss issues and collaborate on problems
 * Video calls on Thursdays for planning and backlogs
 * We will contact the partner via email, but we may also schedule in person meetings
 * Partner is also a U of T staff member so it shouldn’t be too hard to find a time to meet on campus
 
Meetings:
 * We will use task tracking software such as Asana, github cards in order to ensure everyone knows their role
 * Anyone experiencing difficulties can contact the rest of the group during either of the weekly group meetings
 
Conflict Resolution:
 * Scenario 1: Someone is busy and fails to let the group know 

* Resolution: Based on our team rules we understand that one can be busy at times but we will bring it up with them and clarify the reason for their absence. 

* Scenario 2: Someone is being belligerent. 

* Resolution: Based on our rules as defined above the person experincing the belligerent behaviour of the other person would bring it up that person if they were comfortable, if not they could talk to someone else such as Carlson who is responsible for resolving issues. In the event that Carlson is the one being belligerent one can bring it to the attention of Wenqin or Simran.

* Scenario 3: Someone feels excluded in the group.

* Resolution: We designed the team rules to create an open and friendly environment, but it is still possible that someone feels excluded in the group. To resolve such issues, we will use retrospectives where anyone can anonymously create sticky notes for things they would like to see Started, Continued and Stopped. Furthermore, the same conflict resolution path of Carlson -> Wenqin/Simran will be used to handle this issue if one feels more comfortable doing so instead. 
 
 

#### Events

 * We have planned to meet every week for at least one hour in the form of Google hangouts calls, casual in person chats, or a formal meeting at a specified location on Tuesday between 4-6pm. During the meetings, we will discuss issues and collaborate on problems requiring the attention of multiple group members. 
 * We have planned to host brief online meetings on Thursdays for planning and backlogs.
 * We have planned to meet with our partner on most Fridays from 4-5pm to discuss questions and demo updates and discuss with the partner via slack.
 
#### Partner Meetings
##### Meeting 1:
*  We met at the mining building to discuss the intial plan and requirements of the product on Friday, October 5th.

* Discussed: 
   * Workflow
   Given a list of patients
   A patient will have a time of arrival_time, acuity, and whether or not they need an x-ray (and which type of image x-ray they need). This is given as a CSV file.
   * Reception:
   The reception is when a patient first goes to the emergency room and talks to the receptionist with their problems. 
   Since reception has a limited amount of people, a queue may build up at the reception. 
   
   Queue type: priority queue
   Rule about how to insert into the queue that will be defined by the ML researcher. 
   Distribution for how long it takes for someone to be received: normal/gaussian distribution, or possibly other options
   Once received, a patient will go to triaging (most of the time)
   * Triaging: 
   Triaging is when a nurse estimates your case and puts you into a specific patient doctor queue based on how severe the acuity is 
   There will be a queue because there is a limited number of doctors
   Patient doctor interaction
   Once a patient talks to a doctor, the doctor will release or get the patient to do an x-ray
   Once a patient is assigned to a doctor, generally they should stay with the doctor (this can be made enforced or not enforced)
   * Scan: 
   X-ray (time and amount of technicans)
   mri (time and amount of technicans)
   catscan (time and amount of technicans)



Our goal is to build the graph, and we want to see how the graph changes depending on different parameters. 

Assumptions:

- Start simulation as if the patient is new and has no patients

Visualization of queues:

- Queues should be buckets with a granular view of people in the buckets

Input: list of patients defined by arrival time, acuity, x-ray, and other imaging options given in a CSV file

Final output: docker image
Priority queue should be modular where the user can define the insert and pop themselves
Doctor and patient stats

##### Meeting 2:
*  We met at the bahen to discuss any questions and talk about implementation details on Friday, October 12th.

* Topics that were discussed: 
   * We clarified issues pertaining to acquity, the queue functions, and how results should be saved after the simulation terminates.
   * We also discussed implementation and decided on using python for the backend so that researchers could easily modify it in the future. We also decided to use react for the frontend based on the overlapping strengths of the group members. 
   * We also went over testing methods, and requested our partner to provide a sample set of data in order to ensure proper functionality of our project.


#### Artifacts
- Online task board using GitHub cards with some canonical sections:
   * To do
   * In progress
   * In review/Testing
   * Completed
 
- Mockup of the application


----
### Highlights
* We initially thought about using electron for developing the product since we can create a desktop app. In the end, we chose to use python for the backend and react for the front end becuase researchers are more comfortable using python. Our partner pointed out that they would prefer a product that can be modifed and passed on to other developers in the future, and python ended up being the better option. 

