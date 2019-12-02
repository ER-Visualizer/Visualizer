# ED-Simulation/ED-Simulation-VI

## Iteration 3

 * Start date: Wednesday November 13, 2019
 * End date: Sunday November 30, 2019 

## Changes from our `product.md`

Our team successfully scoped, planned and executed the development of the application. As a 
result we did not make any significant changes to our planned product. 

Our team was able to do this for a few reasons:
* Organization 
    > Before any code was written we made a list of everything that needed
    to be done, assigned tasks to everyone and set a deadline for each task. 
    This allowed everyone to know exactly what they needed to do and when
    hence allowing our product to be completed on time. 
* Regular meetings
    > We hosted regular meetings so that team members felt more connected
    to the project, and more responsibility to actually follow through on their 
    tasks as they had to meet with other team members every week to discuss their
    progress.
* Meeting plans
    > Our meetings were productive. Before each meeting, one of our team members
    created a plan of what to discuss during the meeting for each person to see.
    This made sure that no time was wasted and made regular meetings more feasible. 
* Work sessions
    > We ran several work sessions throughout the semester to create time 
    blocks that forced members to work on the project. This ensured
    that tasks were completed on time. The work session also helped
    smooth out integration problems between various parts of the code
    because members of our team could just talk to each other if
    there were any problems. 

### Some the highlights of this deliverable include 
#### Improvements to Visualization

* We changed the format of the node from a circle with no information to a box that shows
that shows all the information about a node in a visually appealing way. This was a feature
and we made the change to make the application more usable.

* We created a visualization of the simulation so that the user can see how patients move
through the various hospital station/nodes. This was a change in feature, and we built this as part of the client requirements with the idea that this feature will allow the client to more easily see how patients move through a simulated
hospital. 

#### Conditional Nodes

* Added predicted edges to use the predictions coming from Vector's machine learning to meet partner requirements of being able to see the performance difference of each simulation. This was a change 
in feature and we built this as part of the client requirements for our program.

* Conditional nodes(Second major part of simulation backend). Can specify rules.

#### Deployment

* We deployed the application to nginx so that it is hosted and can be accessed by anyone
without having to start the development server. This was a change in feature and we 
built this as part of the course requirements requiring a deployed application at the end of the term.

* We created dev and production environments. The development environment is run in a linear environment,
have hot reloading, and display logs, while the production environment disables logs, and hot reloading
to be run faster. This was a change in feature, and we built this so that when our application is hosted
it would run faster. 

#### Other Client Specifications

* User can download CSV of statistics at the end. 3 CSV are generated:
* Hospital_data.csv: Includes general statistics such as the average patient journey time through a hospital, and the standard wait time.
* Patient_data.csv: Includes detailed data on each patient, including the processes that they visited, and how much time
they spent inside of it.
* Doctor_data.csv: Includes information on which patients a doctor was responsible for.
* Used DFS to improve layout of canvas on start of web app
* Can now use Priority Heaps. Can specify your own priority heap
by writing the code on the frontend
* Simulation can be run with randomness or can be derandomized
* Packet rate and packet duration
* Added coordinate system for node locations

#### General UI changes
* Changed format of nodes to highlight key details 
* Made edges more visible, and more easily clickable by expanding the click radius and color of the edge
* Added logging

#### Improved Debugging
* Implemented logging to file 

## Handoff plan

Our handoff plan was as follows:

1. First before the final meeting with our partner we had a meeting to clarify if we had met all of their 
requirements and identify areas we could improve our application. Additionally, we 
gave the partner a full walkthrough for them to critique the product from end to end.
    * From this meeting we were told to create a User guide and Developer Guide, 
    ensure that all user entry fields are validated, ensure that the statistics reported
    at the end of the simulation matched the order of nodes in the canvas, have statistics be downloaded to a specific folder in our docker image at the end of the simulation.
    * We implemented all of those changes.
2. From this meeting we took away key points and improved our product:
   Specifically:
      * We documented code so that future students who work on product understand the simulation logic.
      * Created a dev guide so that future students understand how to extend and modify the code.
      * Created user guides so that our partners and other researchers understand how to use all of its features.
3. We are planning on having a handoff meeting with our partner on Monday after our presentation. During the meeting we will:
   * Give a final walkthrough of the application so that the client is familiar with how it works.
   * Give repository access to the client. The client will be able to access our codebase, as well our docker scripts, developer guides, user guides and GitHub actions (which tests the application for errors).
4. Finally since our partner is well versed in computer science as long as we document
our code and test edge cases they will be capable of maintaining and developing upon our codebase.
