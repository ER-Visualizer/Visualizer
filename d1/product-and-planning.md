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

 * Short (1-2 min' read max)
 * What is the technology stack? Specify any and all languages, frameworks, libraries, PaaS products or tools. 
 * How will you deploy the application?
 * Describe the architecture - what are the high level components or patterns you will use? Diagrams are useful here. 
 * Will you be using third party applications or APIs? If so, what are they?
 * What is your testing strategy?

#### Q5: What are the user stories that make up the MVP?

As a hospital manager, I want to improve customer wait time and see how are they moving
As a hospital, we want to find bottlenecks in the workflow, and to be able to find where we can improve the process either by changing the workflow, or adding/reducing resources.
As a researcher who wants to improve the flow of resources in a hospital, I want to be able to visualize and tune parameters of a simulation,  and show the hospital the potential improvements from my technique
As a hospital, if we have budget cuts, I want to find the most expensive resource we can get rid of, while affecting the workflow the least.

----

## Process Details



#### Roles & responsibilities
 
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


Wenqin: Full Stack developer 
Mit : Full Stack developer 
Victor: Full Stack developer 


Our team has a relaxed and fun working culture. Everyone has their own schedule and time when they work best, so we don’t care when someone works, as long as they finish their part by the agreed upon deadline. In addition, we are supportive of each other. We will try our best to help each other if anyone has questions or needs help. 

Communications:
 * What is the expected frequency? What methods/channels are appropriate? 
 * If you have a partner project, what is your process (in detail) for communicating with your partner?
 
Meetings:
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?
 
Conflict Resolution:
 * List at least three team scenarios/conflicts you discussed in lecture and how you decided you will resolve them. Indecisions? Non-responsive team members? Any other scenarios you can think of?


#### Events

Describe meetings (and other events) you are planning to have:
 * When and where? Recurring or ad hoc? In-person or online?
 * What's the purpose of each meeting?
 * Other events could be coding sessions, code reviews, quick weekly sync meeting online, etc.
 
#### Partner Meetings
You must have at least 2 meetings with your project partner - an initial planning meeting and a document review meeting. Describe the meetings here:
* When and where?
* What did you discuss during the meeting (**note you must have meeting minutes**)?
* What were the outcomes of each meeting?


#### Artifacts

List/describe the artifacts you will produce in order to organize your team.       

 * Artifacts can be To-Do lists, Task boards, schedule(s), etc.
 * We want to understand:
   * How do you keep track of what needs to get done?
   * How do you prioritize tasks?
   * How do tasks get assigned to team members?

----
### Highlights
**Note this section is optional**
YOUR ANSWER GOES HERE ...

Specify 3 - 5 key decisions and/or insights that came up during your meetings
and/or collaborative process.

 * Short (5 min' read max)
 * Decisions can be related to the product and/or the team process.
    * Mention which alternatives you were considering.
    * Present the arguments for each alternative.
    * Explain why the option you decided on makes the most sense for your team/product/users.
 * Essentially, we want to understand how (and why) you ended up with your current product plan.
