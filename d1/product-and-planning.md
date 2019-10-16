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

Researchers with some computational experience.
Hospital Management
Doctors in hospitals

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Users would choose our product because it enables them to study the effect of different settings of the ED. Users will be able to observe things that can be difficult to identify without software, such as bottlenecks in the system. Based on the output, the hospital staff can make informed decisions on how they can make improvements to patient experience and hospital efficiency. For example, in the case of an identified bottleneck, hospital staff can choose to allocate more resources into a particular section of the hospital in order to alleviate the bottleneck and streamline patient care.
The simulations can accept a large number of parameters and will provide helpful visualizations to improve ease of use. Users would also be able to simulate different scenarios depending on what action is taken. While other simulators already exist, they do not offer the full freedom required for exploring alternative scenarios under different conditions. This makes our product superior since our simulations will cover a broader range of possibilities, which will benefit the hospital’s goal to effectively treat as many patients as possible.
Furthermore, our product will be a web application. This increases the accessibility and ease of use for users. Being a web application means that our product can be accessible from a widely increased range of devices. 


#### Q4: How will you build it?

We will build the architecture in Python, with a class-based structure where processes and queues are all classes which communicate with each other.

Our initial plan is to use Flask for the backend and React for the front end. For visualizations we are thinking of using d3.js or vis.gl. We will use numpy and pandas to manipulate the csv. 

The application will be deployed with a docker image that the Vector researcher can run.

We are following a strategy of continuous deployment. Before any branch is merged into master, a series of tests will be run against the branch to ensure that it is functioning. Additionally, everyone is responsible for writing unit tests for their code. Finally, to test usability we will demo the app to the Vector institute periodically to get feedback on how the app could be improved. 


#### Q5: What are the user stories that make up the MVP?

As a hospital manager, I want to improve customer wait time and see how are they moving
As a hospital, we want to find bottlenecks in the workflow, and to be able to find where we can improve the process either by changing the workflow, or adding/reducing resources.
As a researcher who wants to improve the flow of resources in a hospital, I want to be able to visualize and tune parameters of a simulation,  and show the hospital the potential improvements from my technique
As a hospital, if we have budget cuts, I want to find the most expensive resource we can get rid of, while affecting the workflow the least.

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
 
Front end developer
 * Codes the visualization using front-end frameworks such as React
 * Works with the PM(s) and backend developer(s) to develop the product
 
Backend Developer
 * Codes the algorithm behind the visualizations through a backend server
 * Works with the PM(s) and frontend developers(s) to develop the product
 
**Responsiblities**

Simran:
 * Description: Responsible for coding the backend server and the frontend user interface. Is also responsible for organizing meetings and delegating tasks to people. 
 * Strength: Typescript, Flask, continuous deployment, software architecture  
 * Weakness: Indecisive, time, spelling
    
Daniel:
 * Description: Primarily responsible for backend development but can switch to frontend if more attention is required.
 * Strength: Python, Javascript (currently learning react)
 * Weakness: Indecisive, project planning, knowledge of libraries and architectures
    
Wenqin:
 * Description: Responsible for frontend development and backend development, but with a focus on the frontend aspect. Additionally responsible for designing the user interface and testing the products’ final usability.
 * Strength: Frontend development, design, problem solving
 * Weakness: Organization, time management, prioritization 
    
Mit:
 * Description: Responsible for backend development primarily with some involvement in frontend development.
 * Strength: Python, large-scale projects, Django, software design, JavaScript
 * Weakness: Time management, organization, focus too much on the details
    
Carlson:
 * Description: Experienced with developing various applications and is responsible for handling issues and reviews. 
 * Strength: NLP, Javascript, Fullstack Development, APIs
 * Weakness: Availability, organization
    
Victor: 
 * Description: Responsible for mocking up designs and front end development. 
 * Strength: Python, Python Libraries, ML
 * Weakness: Web libraries, linear algebra, design methodologies
    
Nicolae:
 * Description: System architecture, APIs
 * Strength: Python, Flask, software architecture, JavaScript.
 * Weakness: React

#### Team Rules

Our team has a relaxed and fun working culture. Everyone has their own schedule and time when they work best, so we don’t care when someone works, as long as they finish their part by the agreed upon deadline. In addition, we are supportive of each other. We will try our best to help each other if anyone has questions or needs help. 

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

* Resolution: Based on our team rules we understand that one can be busy at times but we will bring it up with them and clarify the reason for their abscence. 

* Scenario 2: Someone is being belligerent. 

* Resolution: Based on our rules as defined above the person experincing the belligerent behaviour of the other person would bring it up that person if they were comfortable, if not they could talk to someone else such as Carlson who is responsible for resolving issues. In the event that Carlson is the one being belligerent one can bring it to the attention of Wenqin or Simran.

* Scenario 3: Someone feels excluded in the group.

* Resolution: We've tried to make the team rules create an open and friendly envirnment but it can still happen that someone can feel excluded in the group. To resolve such issues we will use retrospectives where anyone can anonymously put on stickly notes things they would like to see Started, Coninued and Stopped. Further the same conflict resolution path of Carlson - > Wenqin/Simran can be used to handle this issue if one feels more comfortable doing so instead. 
 
 

#### Events

 * We have planned to meet everyweek for atleast an hour in the form of a google hangouts call or casual in person chats or a formal meeting at a specified location on Tuesday between 4-6pm to discuss issues and collaborate on problems or Thursdays for planning and backlogs
 * We have planned to meet with the partner usually on Friday's from 4-5pm to discuss questions and demo updates and discuss with the partner via slack
 
#### Partner Meetings
##### Meeting 1:
*  We met at the mining building to discuss the intial plan and requirements of the product on Friday October 5th.

* Discussed: 
   * Workflow
   Given a list of patients
   A patient will have a time of arrival_time, acuity, and whether or not they need an X-ray (and which type of image x-ray they need). This is given as a CSV.
   * Reception:
   The reception is when a patient first goes to the emergency room and talks to the receptionist with their problems. 
   Since reception has a limited amount of people, a queue may build up at the reception. 
   Queue type: priority queue
   Rule about how to insert into the queue that will be defined by the ML researcher. 
   Distribution for how long it takes for someone to be received: normal distribution, or possibly other options
   Once received a patient will go to triaging (most of the time)
   * Triaging: 
   Triaging is when a nurse estimates your case and puts you into a specific patient doctor queue based on how severe the acuity is 
   There will be a queue because there is a limited number of doctors
   Patient doctor interaction
   Once a patient talks to a doctor, the doctor will release or get the patient to do an x-ray
   Once a patient is assigned to a doctor, generally they should stay with the doctor (this can be made enforced or not enforced)
   * Scan: 
   Xray (time and amount of technicans)
   mri(time and amount of technicans)
   catscan(time and amount of technicans)



Our goal is to build the graph, and we want to see how the graph changes as we change parameters. 
Assumptions:
Start simulation as if the patient is new and has no patients
Visualization of queues
Queues should be buckets with granularity view of people in the buckets

Input: list of patients defined by xray, arrival time, acuity, different images given as csv 

Final output: docker image
Priority queue should be modular where vector can define the insert and pop themselves
Doctor and patient stats

##### Meeting 2:
*  We met at the bahen to discuss any questions and talk about implementation details on Friday October 12th.

* Discussed: 
   * We clarified questions around acquity and how it works, the queue functions that can be changed and how, and what we would like to save after each simulation
   * We also discussed implementation and finalized for now on using python for the backend so that researchers could easily modify it in the future and react for the front end based on our groups strengths. 
   * We also went over testing methods.


#### Artifacts
Online task board using GitHub cards with some canonical sections:
 * To do
 * In progress
 * In review/Testing
 * Completed
 
Mockup of the application


----
### Highlights
* We thought about using electron for developing the product since we can create a desktop app but choose to use python for the backend and react for the front end becuase researchers are more comfortable using python.

