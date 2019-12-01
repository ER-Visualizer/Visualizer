# Developer Guide for ER | Visualizer
<!-- Use this for spacing -->
<br> 

## Setup

### Installing and running Docker Desktop on Windows

- Double-click Docker Desktop Installer.exe to run the installer.

- If you haven’t already downloaded the installer (Docker Desktop Installer.exe), you can get it from Docker Hub. It typically downloads to your ```Downloads``` folder, or you can run it from the recent downloads bar at the bottom of your web browser.

- Follow the instructions on the installation wizard to accept the license, authorize the installer, and proceed with the install.

- When prompted, authorize the Docker Desktop Installer with your system password during the install process. Privileged access is needed to install networking components, links to the Docker apps, and manage the Hyper-V VMs.

- Click Finish on the setup complete dialog and launch the Docker Desktop application.

### System Requirements for Mac OS

- Mac hardware must be a 2010 or newer model, with Intel’s hardware support for memory management unit (MMU) virtualization, including Extended Page Tables (EPT) and Unrestricted Mode. You can check to see if your machine has this support by running the following command in a terminal: sysctl kern.hv_support

- macOS must be version 10.13 or newer. We recommend upgrading to the latest version of macOS.

- If you experience any issues after upgrading your macOS to version 10.15, you must install the latest version of Docker Desktop to be compatible with this version of macOS.

  Note: Docker supports Docker Desktop on the most recent versions of macOS. That is, the current release of macOS and the previous two releases. As new major versions of macOS are made generally available, Docker will stop supporting the oldest version and support the newest version of macOS (in addition to the previous two releases).

- At least 4 GB of RAM.

- VirtualBox prior to version 4.3.30 must not be installed as it is not compatible with Docker Desktop.

### Installing and running Docker Desktop on Mac
- Double-click Docker.dmg to open the installer, then drag the Docker icon to the Applications folder.

- Install Docker app

- Double-click Docker.app in the Applications folder to start Docker. (In the example below, the Applications folder is in “grid” view mode.)

  You are prompted to authorize Docker.app with your system password after you launch it. Privileged access is needed to install networking components and links to the Docker apps.

  The Docker menu in the top status bar indicates that Docker Desktop is running, and accessible from a terminal.


  If you just installed the app, you also get a message with suggested next steps and a link to the documentation. Click the Docker menu (whale
 menu) in the status bar to dismiss this pop-up notification.


- Click the Docker menu (whale menu) to see Preferences and other options.

- Select About Docker to verify that you have the latest version.

### Instructions 
 
### Setup: Download the docker installer [here](https://www.docker.com/products/docker-desktop) and follow the docker setup instructions above. The website directs you to the correct version base on your OS
Then, start the application by double clicking the docker icon in your Applications folder.

### Running the Application:
Run ```docker-compose down``` - in case you already have docker and have something running on the same port
Then run ```./run_dev.sh build``` - to build the image/run the application
  - The client and server services will be instantiated with the ports indicated in the .env file.
  - The client can be accessed at http://localhost:5000 by default.
In the event that you have already built the image and want to run
it again you can simply run ```./run_dev.sh` ```
Note: you do not have to worry about any other setup either than ensuring you have docker on your device.

In the event that you have issues due to conflicting ports, you can change the values of the following port variables in the env file (located at the root of the repository).
```
APP_SERVER_PORT = {Backend port number - default 8000}
REACT_APP_PORT = {Frontend port number - default 5000}
DEV_ENV = development
WEB_SOCKET_PORT = {WSS port number - default 8765}
```


## Layout 


    backend/     
        app/
            models/
                rules/
                ...
        tests/
            models/
            unit_tests/
    Developer Guide/
        docs/
    frontend/
        node_modules/
        public/
        src/
            components/
                ...
            models/
                ...
            redux/
                ...
    User Guide/
        docs/

* Frontend 
    > `Main.js` acts as the manager for the frontend and intializes the websocket on the frontend and recieves events from the frontend which are then sent to redux
    functions which update the simulation
    > Redux manages the simulation state, specifically the node data, and which 
    sidebars are shown

* Backend 
    > `run.py` in the app folder manages all data, from creating the nodes to 
    sending events
* Entry point of app
    > `main.py` in the backend handles requests to the backend. Currently there 
    2 routes one takes in the csv uploaded from the frontend and parses it to be
    used by the simulation, the other starts the simulation when it recieves a post
    request with the canvas layout 
* Websockets
    > `connect.py` has our websocket class for the backend which sends data to the frontend



## CSV
1. Each row represents 1 patient, and each column its attributes
2. Must have columns with following names(outlined in global_strings.py):
   * time: Indicates the start_time of the patient, i.e when the patient comes into the hospital.
   * id: id of the simulation object(patient in this case)
   * acuity: 1-5
3. For predicted columns, values must be: {"TRUE", "FALSE"}
4. For frequency columns, values must be: >= 0

## End-to-End flow of data


### run.py

1. The entry point starts at the main() function which is called from the REST API /start. The main function then initializes all the required global variables. Then loads the input canvas initializes a thread to start the simulation (SimulationWorker class) and another to start the websocket (by initializing WebsocketServer from connect.py).
2. The SimulationWorker iterates through the input canvas to instantiate all the nodes on the canvas with their paramaters and stores all nodes in a dictionary for future use.
3. A node may contain node or resource rules which are also initialized at this point.
4. Once the canvas is loaded, the simulation reads the input csv file and adds patients into a preemptive node (patient loader), which only serves the purpose of adding patients into the starting point of the workflow (the reception queue
at the right time (as dictated in the csv input).
5. Changes to the simulation (such as patients getting treated by a resource) are represented by Event objects. Event objects have a time attribute which dictate
when they occur, and are stored in an event heap. 
6. Events are handled one at a time, and a global time variable will be updated to the time of the event popped from the event heap.
7. After an event is handled, the patient from the event is placed into the next queues and the Statistics object is updated. The event is then recorded in a list that will be sent to the frontend.
8. When communicating with the frontend, there will be a list of all the processed events. Instead of sending the entire list at once, only a user-specified time interval of events will be 
sent. The user can also specify how often the backend sends changes to the frontend. Since communication is independent of the simulation, changing these parameters will not affect the 
simulation in the backend.
9. Once the simulation finishes, the contents of the final Statistics object will be sent to the frontend and the backend will terminate.

#### Heap

* Simulation is based on a Heap, which contains Event objects. The priority inside the heap is the time the patient will
finish the resource. The heap only contains events which are about a patient finishing a resource, and uses this to track the movement
of time in a chronological fashion. 

### Websocket
* The WebsocketServer class is located at connect.py and sends events to the frontend.
* WebsockerServer has the following attributes:
  * host: The host name the server is being served on (in our use case its localhost)
  * port: The port to send events on.
  * producerFunc: The function to generate events to send to the frontend (send_e from run.py).
  * server: The event loop in the websocket thread.
  * wserver: The websocket server.
  * process: The function to process events in the event heap (process_heap)
  * stats: The function to get simulation statistics.
  * sent_stats: Checks whether stats have been sent.
  * packet_rate: The frequency to send events.
1. The start method is called by run.py which starts the websocket thread that runs until the simulation ends.
2. __producer_handler is then constantly called which is in charge of running the process_heap method from run.py. This allows the simulation to continue running by continuously processing generated events.
3. The rate in which __producer_handler is called is changed by the input packet rate, passed in from the frontend. Thus, this then allows the rate of the simulation to be changed.
4. Based of process_heap, __producer_handler will either continue sending generated events, or generate the statistics of the simulation then send them and close its sockets.
5. The class also formats the generated statistics to be in a CSV format to be send to the frontend.
6. To generate the CSV file, since process names are column headers, it is more readable if the column headers are sorted in order of traversal through the canvas. nodes_in_bfs_order() returns a sorted list of process names.

### Models

#### Nodes

* Nodes are the fundamental building blocks of the simultation. They represent a process such as:
*reception*, *triage*, *doctor's office*, etc. 
* Nodes have the following attributes:
  * id's which are used to uniquely identify a node. `Note`: *Id 0 is reserved for Reception*, and *Id -1 is reserved for the patient_loader(see details above in run.py)*
  * Queue_type: There are 3 types of queues: Stacks, Queue, and Priority Heap. The user specifies on the front-end what kind of queue he wants to use. *See Queues* for more details
  * priority_function: priority_function is set only if the user chose a priority queue on the frontend, otherwise it's none.
  * num_actors defines the number of resources/actors inside the resource. A resource will have a minimum of 1 resource, which means there is only 1 employee/doctor/member of staff/etc operating in there. 

#### Resource

* A resource is the smallest functioning element inside the simulation. A resource always exists only inside the nodes and represents 1 independent unit which takes simulation objects(patients) for a duration of time. **Let's consider an example: if we have an X-ray Node, with 3 num actors, a resource will be an X-ray machine, and the node has 3 x-ray machines.**

* **Attributes**
  * Id: id of the resource inside of the node, since there can be multiple. They
  are automatically generated when a node is initialized based on number of actors.
  * curr_patient: if the curr_patient is set to None, that means that the resource is currently available. Otherwise, the attribute will be set to the id of the
  simulation object/ curr_patient id that the resource is occupied with
  * finish_time: if curr_patient is not None, then finish_time will indicate when
  the resource will complete its work with the patient, in this case it will indicate when a patient finishes the X-ray).
  * duration: duration of the current, in this case how long this curent X-ray lasts. 
  * resource_rules: Resources can have rules applied to them. In order for a patient to be inserted to a
  specific X-ray machine, it first needs to pass the rule for the X-ray machine. An example of a rule is:
  you need above a specific acuity to use this X-ray. See **Rules** for more.
* **Methods**:
  * insert_patient(): Inserts a patient into the resource. Sets the attributes(patient, node_id, finish_time, duration). Sets the patient as unavailable.
  * clear_patient(): i.e patient finishes the resource so clear him out of it. Set the patient as available, so he can join other resources, and set curr_patient and finish_time to None.
  
#### Patient

* A Patient is the simulation object that moves around. Patients are declared in the CSV file, 1 patient per row. They don't have to be patients. You can include any object in the CSV that you want to run the simulation on, and you can include any properties there.
* Attributes:
  * properties: This is the dictionary of 
 
#### Events

* Event objects on the heap contain the patient, the time he will finish a resource, and the node id and resource id.

#### Resources

#### Queues

#### Rules
* There are two categories of rules: NodeRules and ResourceRules.
	* NodeRules apply to a node object, and include FrequencyRules and PredictionRules. 
		* A node with a FrequencyRule can be visited multiple times by a patient
		on a case to case basis (i.e. each patient will visit a different number of times). 
		FrequencyRule objects keep track of which column in the patients csv file 
		the program has to read from in order to see how many times a patient has to reenter a node.
		* A node with a PredictionRule has a conditional patient admittance behaviour. For example, a
		patient can be predicted to require a scan, so they can be preemptively added to the waiting queue
		before being seen by the doctor. 

* Rules are passed They are created when reconstructing the wusing a RuleCreatorFactory class that is called in create_queues, located in run.py. 

* Where they're generated
* How to extend( how to add more rules, how to add rules just for 1 resource.)
* Node Rules
* Resource Rules


### Rules

1. Each node has a list of nodeRules. These are rules that a patient must satisfy in order
to be allowed inside a node (where he can occupy a queue or a resource). If patient fails any
of the rules then the patient is admitted into the process.
2. Each node has a list of resourceRules. All resources share this list, i.e in order for a patient
to be admitted into a specific resource, he must pass all of the rules for it first. ResourceRules 
also dictate how patients are removed from the queue of the process.

HEre

# How to’s 
### Backend 
* Add a new field to csv and have it used by priority queue
    * A: The code has been made easily extensible and hence when a field is added to the patient it is parsed by our code and added to the patient object's dictionary.
* Add more stats 
    * A: In `statistic.py` you have the ability to add more stats
    based on the info of the application
* Add a new route for the app
    * In `main.py` define a new route following the classical flask definition methods
* Add more rule types
	* To add another rule option to the current list of resource or node rules, add another case to the 
	_create_rules function in the NodeRuleCreator or ResourceRuleCreator class. These classes can be found in rule_creator_factory.py.
	* To add a rule type that does not apply to resources or nodes, add another case to the create_queues function in
	the RuleCreatorFactory class. The canvas JSON structure and create_queues function in run.py will also have to be modified to call create_rules
	using the new RuleCreator class.

### Frontend
* Add a button 
    * A: In  ```Navbar.js```  define a button using standard convention in the render method, you can create styling for it in ```Navbar.css`` . 
    To update the state of the application you have to create your own action in redux as well a method in ```reducers.js``` to execute your update.

* Change the graph
    * In the folder react-d3-graph you have access to the node structure and change the rendering and layout/styling of nodes.
    * In ```Main.js``` there is a graph config object and also a function to map redux's graph model to react-d3-graph's graph model.
    * For more detailed information on the original package, visit https://goodguydaniel.com/react-d3-graph/docs/index.html 

* Change styling of components 
    * Every react component has its own css file. To change the graph, see the previous subsection.


* Change styling for core components (not sure what to call it )
### Devops 
* Change ports
    * A; in the root directory of the app there is a ```.env``` which you can modify to update the ports 
* Change build settings 
    * A: Depending on if your using production or develop there are two serpate docker compose files in the root level of the app, which can be edited, further there are individual docker files for the frontend and backend which can be further changed 
* Add a new requirement in the backed
    * A: Simply add the package you want to the requirements.txt file in the backend folder, and then run either ```./run_dev.sh``` or ```./run_prod.sh``` depending on your preference to rebuild with the new requirement
* Change hosting 	
    * A: 
* Script Usage 
    A: 

## FAQ
* Q: When I add an npm package, I get an error saying that it can't be resolved even though I ran ```npm install```
    * A: stop the docker image you currenly have running by pressing command + c in your terminal 
    Then run ```./run_dev.sh build```
* Q: Whenver docker runs, it takes up a lot of space on my computer, is there a way I can remove all images.
    * A: run ```docker system prune``` to remove all docker images
* Q: How does docker work, is this is sometype of witchcraft?
    * A: Yes.... 
* Q: Why does take so long to run 
    * A: The docker image is building both the frontend and backend 
    requirements hence it had to install several packages hence it takes a larger amount of time. If you already built the image ie ran ```./run_dev.sh` build ```then run  ```./run_dev.sh`  ```
    
* Q: Why must there be at least 1 node at all times?
    * A: This is a limitation of react-d3-graph.
* Q: Should I use the index or the id to identify a node?
    * A: Use the id, indices are subject to change on deleting/adding nodes.
    
 