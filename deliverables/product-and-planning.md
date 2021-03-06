# ED-Simulation/ED-Simulation-VI

## Product Details

#### Q1: What are you planning to build?

Our product is an application that will simulate patient trajectory through an emergency department. 

The ED simulation will enable researchers to quickly see how changes to the ED (such as the # of doctors, and how patients are moved from doctor to doctor) result in different patient experiences and ultimately allow researchers to develop a better experience for hospital patients. For example, a hospital dealing with long wait times, will use the simulation to develop a new ED patient trajectory to reduce patient wait times. 

![Diagram 1](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/images/Diagram1.png)

![Diagram 2](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/images/Diagram2.png)

The above diagrams showcase an example of what the product might look like, where the first one showcases
a overall view of the canvas of the simulation (including the different waiting queues which represent 
different zones in hospital as well as the relation between these queues). The second diagram showcases
what it would like if a user were to click on one of the queues and the type of informaiton they should see.

#### Q2: Who are your target users?

- Researchers that want to test a hypothetical improvement on the workflow.

- Hospital Management staff looking to improve the ER workflow by restructuring and adding
new processes to their existing workflow and checking whether it reduces wait times.

- Hospital Management staff looking to add or remove resources (i.e staff) and wanting to see the consequences.

- Doctors in hospitals trying to optimize their schedules.

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Users would choose our product because it enables them to study the effect of different settings of the ED. Users will be able to observe things that can be difficult to identify without software, such as bottlenecks in the system. Based on the output, the hospital staff can make informed decisions on how they can make improvements to patient experience and hospital efficiency. For example, in the case of an identified bottleneck, hospital staff can choose to allocate more resources into a particular section of the hospital in order to alleviate the bottleneck and streamline patient care.

The simulations can accept a large number of parameters and will provide helpful visualizations to improve ease of use. Users would also be able to simulate different scenarios depending on what action is taken. While other simulators already exist, they do not offer the full freedom required for exploring alternative scenarios under different conditions. This makes our product superior since our simulations will cover a broader range of possibilities, which will benefit the hospital’s goal to effectively treat as many patients as possible.
Furthermore, our product will be a web application. This increases the accessibility and ease of use for users. Being a web application means that our product can be accessible from a widely increased range of devices. 

Existing competitors are Patient Flow Simulator (https://khp-informatics.github.io/patient-flow-simulator/index.html) and Simul8 (https://www.simul8.com/). However, Patient Flow Simulator is not very customizable and although simul8 is very customizable and provides good statistics, it is very expensive and not directed at the medical domain.


#### Q4: How will you build it?

We will build the architecture in Python, with a class-based structure where processes and queues are all classes which communicate with each other.

Our initial plan is to use Flask for the backend and React for the frontend. For visualizations we are thinking of using d3.js or vis.gl. We will use numpy and pandas to manipulate the CSV. 

The application will be deployed with a docker image that the Vector Institute researcher can run.

We are following a strategy of continuous deployment. Before any branch is merged into master, a series of tests will be run against the branch to ensure that it is functioning. Additionally, everyone is responsible for writing unit tests for their code. Finally, to test usability we will demo the app to the Vector institute periodically to get feedback on how the app could be improved. 

The data required for the simulation to run will be uploaded as a csv file on the frontend of the app. Where the csv will be then parsed and sent to the backend. Predictions on whether patients need xrays are also specified in that csv. 

#### Q5: What are the user stories that make up the MVP?

##### User Story

Angela is a Chief Quality Officer. She wants to model the patient flow across
the Emergency Room for a number of days in the simulation, in order to get a
birds-eye view of the ER, backed by data. She wants to use that to identify the
processes where patients wait the longest amount of time, as well as average waiting times for
patients with different acuity levels, in order to see how well the hospital is performing for different
groups of patients. 

##### Acceptance Criteria

* Load a CSV of patient flows.
* Ability to collects statistics about average waiting time for process, average waiting time by
acuity, and average waiting time for process by acuity.

##### User Story

Mohamed is a Machine Learning researcher who wants to improve the efficiency of the X-Ray machine in a hospital.
He developed a Machine Learning Algorithm to predict whether a patient will need
an X-Ray before he sees a doctor. His goal is to distribute the work on the x-ray
machine more uniformly, with an algorithm that predicts correctly whether a patient
will need a scan or not.

##### Acceptance Criteria

* Ability to specify his algorithm predictions for each patient.
* Ability to select the processes from which the user can go directly to the X-Ray Machine.
* Ability to run simulation with X-Ray predictions, and without, in order to determine
whether his ML model has decreased the average waiting times for the X-Ray machine.

##### User Story

After waiting in the hospital with her relatives for over 8 hours, Daniela Rosu, a Professor at The University of Toronto,
realized that the order by which patients are queued for a process(X-ray, PD, triage)
is dangerously underperfoming. This can even
lead to deaths if patients with very high acuities wait too long to receive emergency care. She wants
to try out different priority functions for the priority heaps which model the process. Her goal
is to come up with a priority function that is more fair to patients that have higher acuities,
and at the same time, takes into consideration the amount of time that they spend there.  

##### Acceptance Criteria

* Ability to code, or specify otherwise, different priority functions for a process.
* Ability to run simulation with the normal hospital priority functions and her
priority functions, collect a CSV file of data that contains average waiting times for each patient, along with the
acuity of the patient, and then analyze whether she has successfully improved the
fairness or the efficiency of the process. 

##### User Story

Jordan, a hospital manager has gotten a grant from the government, and with the money he can buy a new
new x-ray machine, or a CT scanner. He knows right now that patients wait an exhorbitant amount of time
in Emergency Room, so he wants to add the resource which will have the biggest impact on reducing wait times.

##### Acceptance Criteria

* Ability to change number of resources for each process.
* Ability to run simulation with different amounts of resources and collect a CSV file
for each simulation which contains average waiting times for each patient, and overall
average waiting time. He will then use the excel files to find out which change has improved waiting
times the most.

##### User Story

Jordan is a hospital manager. This year his hospital has had $1 million dollars budget cuts, so unfortunately,
he has to fire some of the staff. He wants to fire the staff which is least critical to the workflor of the Emergency Room, i.e
the staff who will have smallest impact on increasing the wait times.

##### Acceptance Criteria

* Ability to  change of resources for each process.
* Ability to run simulation with different amounts of resources and collect a CSV file
for each simulation which contains average waiting times for each patient, and overall
average waiting time. He will then use the excel files to find out which change has increased waiting
times the least.


##### User Story

Teo is a Chief Operations Officer. He wants to model the emergency room across time,
to determine the capacity requirements for different processes on different days/months. He wants to see how many beds
are used around holidays versus normal days, in order to make sure the right number of resources is available around peak times.

##### Acceptance Criteria

* Receive statistics which document how many people have used each process(hospital beds, X-ray machine) per day.

##### User Story

Christine is a Safety Inspector. She found that a patient at the hospital had a very contageous disease. She wants to see a log of 
the resources the patient has visited during his stay at the hospital, in order to inspect all of the places the patient visited,
and the doctors/staff he came in contact with.

##### Acceptance Criteria

* Receive a log of the flow of each patient throughout the hospital, documenting all of the processes a patient has visited, in the
right order, with timestamps.

----

## Process Details


#### Roles & responsibilities
**Roles**

Organizer/Lead: Simran
 * Sets deadlines for tasks
 * Organizes meetings
 * Makes sure that everyone is completing their tasks on time
 
Product Manager: Wenqin/Simran/Carlson
 * Talks with the Vector Institute and other stakeholders to determine what should be developed
 * Creates specification documents detailing what should be built
 * Sets tasks based on the specification document
 
Designer: Wenqin: Wenqin
 * Designs the user interface to make it look good
 * Tests the user interface on clients to ensure that it is usable
 
Frontend developer: Victor, Wenqin, Carlson, Simran
 * Codes the visualization using front-end frameworks such as React
 * Works with the PM(s) and backend developer(s) to develop the product
 
Backend Developer : Mit, Nicolae, Daniel, Carlson, Simran
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
 * Members are held accountable by our groups fundamental of respect and the fact that they dont want to tarnish relationships with their friends. Further Simran is repsonsible for following up with members for meetings and Wenqin is responsible for following up with members for tasks.
 
Conflict Resolution:
 * Scenario 1: Someone is busy and fails to let the group know 

* Resolution: Based on our team rules we understand that one can be busy at times but we will bring it up with them and clarify the reason for their absence. 

* Scenario 2: Someone is being belligerent. 

* Resolution: Based on our rules as defined above the person experincing the belligerent behaviour of the other person would bring it up that person if they were comfortable, if not they could talk to someone else such as Carlson who is responsible for resolving issues. In the event that Carlson is the one being belligerent one can bring it to the attention of Wenqin or Simran.

* Scenario 3: Someone feels excluded in the group.

* Resolution: We designed the team rules to create an open and friendly environment, but it is still possible that someone feels excluded in the group. To resolve such issues, we will use retrospectives where anyone can anonymously create sticky notes for things they would like to see Started, Continued and Stopped. Furthermore, the same conflict resolution path of Carlson -> Wenqin/Simran will be used to handle this issue if one feels more comfortable doing so instead. 
 
 

#### Events

 * We have planned to meet every week for at least one hour in the form of Google hangouts calls, casual in person chats, or a formal meeting at a specified location on Tuesday between 4-6pm. During the meetings, we will discuss issues and collaborate on problems requiring the attention of multiple group members. 
 * We have planned to host brief online meetings on Thursdays for planning and backlogs, further during these meetings we will divide tasks based on the current progress and updates
 * We have planned to meet with our partner on most Fridays from 4-5pm to discuss questions and demo updates and discuss with the partner via slack.
 * For coding we will have work sessions on occaions, specifically we had work sessions during reading week and during weekends. 
 * We will also be coding individually on own time, if not during work sessions
 
 
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

* Summary: 
  * We learned about the project and were walked through the inital plan of the meeitng and the scope of the project 
  * We also learned about other simulations and the goal of the project ie to be able to display to researchers simulations and allow them see the impact of changing certain perameters 

##### Meeting 2:
*  We met at the bahen to discuss any questions and talk about implementation details on Friday, October 12th.

* Topics that were discussed: 
  * We clarified issues pertaining to acquity, the queue functions, and how results should be saved after the simulation terminates.
  * We also discussed implementation and decided on using python for the backend so that researchers could easily modify it in the future. We also decided to use react for the frontend based on the overlapping strengths of the group members. 
  * We also went over testing methods, and requested our partner to provide a sample set of data in order to ensure proper functionality of our project.

* Summary: 
  * After first learning about the project we worked on developing questions and possible implementations and at this meeting asked those questions to Vector



#### Artifacts

1. **Pictures**. We drafted some mock-ups of the simulation before starting. This was to
develop a shared understanding with Vector on what the requirements are. Additionally, we used
this to start brainstorming on what the backend needs to do, as well as have a base-line for the minimum
needed for the front-end.

![Diagram 1](images/Diagram1.png)

![Diagram 2](images/Diagram2.png)


2. **Comments**: We use comments to document  various design choices, and explain the logic
behind the code, the which is especially critical when we're implementing the simulation.
Here's an example of pseudocode developed during one of team sessions:

```python
 '''
    Try to insert a patient into an available resource, if there exists one.
    Return true if patient inserted successfully.
    
    Will be false only if:
        - All resources are currently occupied
        - Doesn't pass the rule for any of the available resources
            - If a resource is available, then we know that
                - either queue is empty
                - none of the elements in the queue passed the rule for this resource, so then try the current patient
                    to see if he passes
    Will be true only ifif:
        - Patient is available, and there is a resource in the process that is available,
            and patient passes the rule for a specific resource
    '''

    def fill_spot(self, patient):

        # 1. Check: Is patient busy? If no, proceed
            # Iterate through all Resources in random order and check
            # 1. Is resource available
            # 2. If it's available, does this element pass the resource rule
            # 3. If yes, insert the patient into the specific resource(existing method
            # 4. Add the element on the heap
```

3. **Meeting Minutes**: We document all of our meetings, both internal and external with Vector.
Whenever we're not sure about something that we discussed with Vector, or some details
we decided on as a team, we can check the meeting notes. It also serves as a way to make
sure everyone is kept up to date on the development of the project, even if they missed the meeting.

[Link to Meetings Minutes](https://drive.google.com/open?id=1ftzBkQdU7P4RSA6EvPqXnF9qdQxPVwyV)

4. **CRC Cards**: We used CRC cards in order to brainstorm the design of the simulation
and the base clases that we needed for it.

![CRC Cards](images/crc_1.png)

![CRC Cards](images/crc_2.png)


----
### Highlights
* We initially thought about using electron for developing the product since we can create a desktop app. In the end, we chose to use python for the backend and react for the front end becuase researchers are more comfortable using python. Our partner pointed out that they would prefer a product that can be modifed and passed on to other developers in the future, and python ended up being the better option. 

