# ED-Simulation/ED-Simulation-VI

## Iteration XX - Review & Retrospect

 * When: November 13, 2019
 * Where: Bahen Centre for Information Technology

## Process - Reflection
Throughout the whole process of creating the first phase of our application, there were many things we did correctly but also a couple of things that went wrong, which are good lessons for us, moving forward.

#### Decisions we made that turned out well:

1. To make our meetings as meaningful and efficient as possible, we created a document with a list of all of our questions going into the meeting. This ensured that we didn't forget to ask about something that we needed to and that we didn't waste any time in the meeting thinking about what to ask. We also created a meeting notes document and had delegated the task of taking meeting minutes to one of the team members before each meeting. This was a good decision because if one of the team members couldn't make it to a meeting, they can easily refer to this document to get a brief summary. Furthermore, if nothing was written down from the meeting, there is a high probability that we would forget about an important detail afterwards.

Here is one of our meeting notes: https://docs.google.com/document/d/1DekoRbvQqSQ7un9vQMWB_kEwdjWPHJGxvcteECTR4Gs/edit?usp=sharing

2. Another decision that turned out well for us was organizing meetings with our partners very early on in the process. This allowed us to get all the information we needed and get all of our questions answered early to maximize the time spent working on the actual application. If we had not done so, we would be making assumptions when developing and if those assumptions turned out to be wrong, it would have been a time consuming process to redo parts of the application.

3. We used a feature in GitHub for organizing our tasks and backlog called GitHub Cards. This is a very convenient way to get a holistic picture of the current progress of our project. Because of the way we structured it, it allows us to see who is doing what tasks, their current status, what tasks are unassigned and left to be done, as well as ask for help if one of us is stuck.

Here is a screenshot of the current state of our GitHub Cards: ![GitHub Cards](images/GitHub-Cards.png)

4. Before doing any coding, we wrote a document brainstorming possible options that we could use for implementing some of the main parts of our system. One such example is whether to use multithreading or not and what are the alternatives. We also summarized the workflow of the whole application to give ourselves a clear idea of the order in which things would happen in the simulation. By creating this document, it gave each of us a clear direction on how to proceed forward, and therefore, it allowed us to work more productively, saving us potential time that we might have used otherwise.

Here is the document: https://docs.google.com/document/d/1hfjI4DrQ9rsrOYkc0erd4Lcpl9Y7UGgjy0oEzgq8Wzo/edit?usp=sharing

#### Decisions we made that did not turn out as well as we hoped

1. We decided to have fewer "work sessions" to allow people to have more time to code on their own schedule. The problem with this is that work sessions are important to allow the frontend and backend teams to integrate each other's code. Without more work sessions, the work that the team does goes to a stall, and as a result less work gets done. A good solution to having more work sessions is determining everyone's availability and having regular work sessions when everyone is free. 

2. We decided to start coding as quickly as possible without doing detailed planing of the software architecture. This was bad for several reasons. For one, it resulted in wasted code. For instance, the backend team wrote a websocket class and then realized that the frontend team handled the websockets in a different way. As a result the backend team had to completely rewrite the backend websocket class to accomodate the frontend. In addition, there was an increase in bugs: since the backend and frontend teams did not know what data format to expect from each other, there were a lot of integration bugs that needed to be fixed. Finally, the project just took much longer than it needed to because of all the integration problems that required more meetings and back and forth communication than was necessary. 

3. We decided to split up coding tasks in ways that that did not allow team members to work on their part individually. This resulted in a lot of dependencies in our code and tight coupling between components. This was bad for a few reasons. First reason is that the team needed to constantly meet to make significant progress due to dependencies resulting in wasted time from potentially unnecessary meetings (and the travel time associated with them). Second reason is that, the code became less modular. As a result, it will be hard to adapt the code to perform a slightly different task due to tight coupling between components. The final reason this decision was bad is that it increased the number of bugs. Due to the dependencies between components it was hard for a team member to fully test their code, and as a result a lot of untested bugs cropped up.

#### Planned changes

It is crucial to learn from your past mistakes and make any necessary changes to fix them to prevent them from reoccurring.

 * One change that we will be making to our process is to schedule more work sessions where we all meet together, or at some people doing the frontend and some doing the backend. This is required to allow seamless integration of the backend with the frontend without having to worry about it at the very end. Leaving it all to the end could mean wasting excess time trying to integrate the two sides instead of doing meaningful work that extends the application's features.

 * Another process-related change that we are planning to make is to write good documentation that everyone in the team can access which outlines the interface to use (i.e. what methods to call) to integrate that specific part of the application. Furthermore, since the backend will send data in a particular JSON structure to the frontend, we will also discuss that structure so that the frontend team can continue their work, knowing the correct structure that they will receive data in.


## Product - Review

#### Goals and/or tasks that were met/completed:

 * We developed and implemented the main part of the project: running the actual simulation. Currently in D2, you can already pass
a Canvas of nodes that describes the emergency department structure, and a CSV file of the patients and the simulation will execute correctly.
While not all requested  features for the simulation have been implemented yet, the main back-bone is built, and only small extra features need to
be added to it now(conditional nodes, rules for processes, etc).
 * We have implemented statistics gathering inside the simulation, so once the simulation finishes, we generate a JSON 
that collects the main client-requested statistics(average waiting time in queue, average wait time per patient, etc.) 
 * We were able to display interactive, draggable nodes on the screen with connections between nodes. This functionality will be used by the user
to build the Emergency Room layout, i.e place reception in front of triage, connect triage to Doctor Process, etc. 
 * Backend websocket server which connects backend to frontend - note: to view have to be in socketSetup branch for now as we continue to integrate
    * can locate by going to this location from root (backend/app/connect.py)
    * [connect.py](../backend/app/connect.py)
 * Docker setup
    * [Backend Dockerfile](../backend/Dockerfile)
    * [Frontend Dockerfile](../frontend/Dockerfile)
    * [Docker Compose](../docker-compose.yml)
 * We were able to create a log viewer on the screen to display simulation events.
 * Parsing CSV data and inserting patients into the simulation.

#### Goals and/or tasks that were planned but not met/completed:

 * We were unable to create functionality to allow a user to edit the details of a node. This was mainly because there were many features that we needed to implement and this one was not a priority for this deliverable since we were focused on making sure hard coded node values worked before allowing user customization.
 * Another task that we were not able to complete was setting up Travis CI because it requires authentication, which we are currently in the process of getting.
 * Although we have many independent aspects of the system working, and many of them working together, the **full** integration of the different parts is not completed yet. This is because we prioritized on making the individual parts work correctly first and have not gotten to integrating all of the parts yet.
  
#### How was your product demo?

 * How did you prepare your demo?

    * One day before the demo, we held a final meeting where we made sure the application was
    functional and that all the main components were integrated, i.e data was flowing correcly from the backend to the frontend. Once everything was integrated, all of us ran it on our local devices, and looked for bugs. Once we spotted a bug, we wrote it in the group chat and someone picked it up, fixed it, and then pushed it upstream. This ended up being a 4 hour work session where we identified and fixed many issues.  

* What did you manage to demo to your partner?

   * We demonstrated the simulation functioning correctly. We ran through 1 canvas(hospital layout), and different patient CSV's. We started with a small CSV of 10 patients to show the correctness of the simulation, and then showed the simulation running on 1000 patients. We did not manage to show simulation running on other canvases due to lack of time.
   * On the frontend, we demoed the general design of the web interface, displaying the main UI elements (buttons, sidebar, text fields) and the overarching design theme. We did not show patients moving through the simulation, as this is a planned goal for D3. 
   * We showed that the backend and frontend were integrated and communicating with each other. The backend was sending the events live to the frontend, which then showed a log of the events taking place as a text representation, as the animated representation(visual queues) is scheduled for D3.
   * At the request of our partner, we described the structure of our backend at a technical level, including the different classes, their attributes, connections between classes, and other data structures we used to represent the state of the simulation.

 * Did your partner accept the features?
  
    * The partner was happy with the system architecture. They stressed the importance of making the architecture very extensible for different
hospital scenario, which is a key requirement for them. They also stressed that documentation is very important to them, because whoever
who will work on the simulation in the future, needs to be able to understand fully how everything works. 

 * Were there change requests?
  
   *  We received a couple of change request that allow for easier maintenance and extensibility. They are summarized below:
      * Previously we only created restrictions per resource. Partner requested to be able to create restriction per process as well.
      * Possibly support multiple actors per patient. This is something that the partners will get back to us on.
      * Make sure that the class system is as extensible, and flexible as possible by using interfaces and abstract classes.
      * Change some class names so that the names align better with their actual role (Ex. Resource -> Actor)
      * Remove the join_queue_time attribute from the Patient class because it causes coupling with Statistics class.

 * What did you learn from the demo from either a process or product perspective?
  
    1. We learned that we need to be frequently thinking about maintainiblity and extensibility as we write code. For this, we need to ensure that we use the most relevant design patterns which decouple our code and make it extensible. This is very important so new featues can be added easily and without breaking anything else. This is especially important when a new member who has not seen the codebase tries to add a feature.
    2. At some point, our group is going to stop working on this codebase and some other group might take over in the future. To make it easy for them to understand the codebase from scratch, it is crucial that we use very easy to understand names in our system architecture.

## Meeting Highlights

Going into the next iteration, our main insights are:
 * Create a solid plan of tasks before coding so that everyone knows what to do. We found that by having a good plan of
   what everyone needed to do, it reduces the need for time intensive work sessions and increases productivity as people
   can work on their part without the need for other people. 
 * Continue with regular meetings so that everyone is accountable for getting their work done. We found that by having regular meetings team members were more engaged and less likely to procrastinate due to peer pressure. 
 * We will need to work on displaying the simulation on the frontend. At the moment the frontend only receives the events of  the simulation that
   the backend processes and does nothing useful with it. The next step should be to take the events and actually visualize the simulation on the frontend. 
   
