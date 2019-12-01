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

---------------------------------------------------

### Models

#### Nodes

* Nodes are the fundamental building blocks of the simultation. They represent a process such as:
*reception*, *triage*, *doctor's office*, etc. 
* **Attributes**:
  * id's which are used to uniquely identify a node. `Note`: *Id 0 is reserved for Reception*, and *Id -1 is reserved for the patient_loader(see details above in run.py)*
  * Queue_type: There are 3 types of queues: Stacks, Queue, and Priority Heap. The user specifies on the front-end what kind of queue he wants to use. *See Queues* for more details
  * priority_function: priority_function is set only if the user chose a priority queue on the frontend, otherwise it's none.
  * num_actors defines the number of resources/actors inside the resource. A resource will have a minimum of 1 resource, which means there is only 1 employee/doctor/member of staff/etc operating in there. 
  * resource_dict: a dictionary which contains the resources as their values(built based on the number of actors), and the ids of resources as keys.
  * distribution_name and distribution_params: the parameters of the distribution that will describe how much time a patient spends inside a resource for this particular node.
  * output_process_ids: the nodes that the patient will go to once he finishes this current node.
  * static dictionary of nodes `node_dict` which contains all of the nodes with 
  their ids as values.
  * node_rules: all of the rules for a specific node.
* **Important Methods**:
  * Technically, nodes are the ones that run the simulation. They move the patients from one to another, ass the patients into the right resource, into the right queues.
  * handle_finished_patient(resource_id)
    * Called from run.py whenever an event is popped off the heap, which 
    signifies that it finished. At that point, handle_finished_patient() is called which is responsible for 2 things: insert patients into the next nodes
    that the patient needs to go to, fill the resource that the patient just finished with an appropriate patient from the queue of the node.
    * Because the patient is still in some queues, the node attempts to insert him into resources for the nodes where the patient is still queued(patient is still in queue to get a CT-scan so handle_finished_patient() will check to see if any CT scans have been freed), as well as into the outgoing nodes from this current node(i.e this node is triage and has an outgoint edge: Triage->Doctor).
  * put_patient_in_node(patient):
    * Called whenever a patient is inserted into a node X.
    * First check if patient passes all of the rules which make him eligible to be inside of node X(e.g: have acuity > 5, etc).
    * If passes all rules, then try to insert him into a resource. If that fails,
    place him inside the queue.
  * put_inside_queue(patient):
    * place patient inside of ahe queue, and put that into patient's current record
  * fill_spot(patient):
    * Patient is passed and attempts to enter any available resources. If either
    the patient becomes unavailable, or all resources are busy, fill_spot returns False.
    * If The patient is available, and a resource is free, and patient passes the test for it, `insert_patient_to_resource_and_heap` gets called.
  * `insert_patient_to_resource_and_heap(patient, resource)`:
    * Patient is inserted into the resource,his patient_record gets updated, and he is set as unavailable.
    * **An event is created and inserted onto the heap with the finish time of when the patient will finish the given resource.** So whenever a patient is inserted inside a resource, the event gets registered on the heap.
  *  `fill_spot_for_resource`:
     *  Called when a patient finishes a resource, so the resource becomes available and can take another patient. Resources will attempt to take another patient from the queue of the node. If a patient is available and passes its rules, he is inserted into the resource by again calling `insert_patient_to_resource_and_heap(patient, resource)`. He is removed from the queue, and his patient record gets updated.
* 
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
* **Important Methods**:
  * insert_patient(): Inserts a patient into the resource. Sets the attributes(patient, node_id, finish_time, duration). Sets the patient as unavailable.
  * clear_patient(): i.e patient finishes the resource so clear him out of it. Set the patient as available, so he can join other resources, and set curr_patient and finish_time to None.
  
#### Patient

* A Patient is the simulation object that moves around. Patients are declared in the CSV file, 1 patient per row. They don't have to be patients. You can include any object in the CSV that you want to run the simulation on, and you can include any properties there.
* Attributes:
  * properties: This is the dictionary of all attributes for the patient from the CSV, where the key is the name of the column,
  and the value is the value in the column.
  * is_available: False if patient is inside a resource. Patient can only be inside 1 resource at a time, and this is used to make sure this is satisfied.
  * patient_record: a record for the patient of all the nodes he has visited already, the current node he is in(otherwise None), and all the queues he is in.
* Important Methods:
  * set_available(). This is called from inside resource.clear_patient(), so whenever a patient finishes a resource, he's automatically set to available.
    * sets is_available property
    * sets curr_node in patient record to None
    * clears the queues_since_last_finished_process attribute, since that list contains all of the queues the patient has been added to since the last
    node he has finished, and since a patient is set available when he finished
    a resource, that means he just finished it, so we need to reset that list
  * set_unavailable(): This is called from inside resource.insert_patient().
    * sets the is_available attribute to False
    * sets the current node inside the patient record

#### ObjectRecord

* An objectRecord is a record for a patient that contains infromation about all the nodes a patient has visited already, the current node he is in(otherwise None), and all the queues he is in.
* Attributes:
  * object_id: id of the patient
  * visited: represents a list of `node_acces_info` objects`, i.e all the nodes the patient has visited, in the corred order with extra information.
    * Properties of a node_access_info:
    ```
    self.process_id = curr_process_id
    self.resource_id = curr_resource_id
    self.resource_start_time = start_time
    self.resource_end_time = end_time
    ```
  * curr_node: a `node_access_info` object` for the current_node the patient is in.
  * Queues:
    * queues_since_last_finished_process:  list of the queues a patient is added to in a current round, i.e since patient finished his last node.
    * old_active_queues: queues the patient is still in, that are not part of the current round.
 

#### Queues

* 3 types: Stack, Heap, and Queue.
* All classes have an iterator defined, so that the user can iterate through the objects inside of the queue in the right order.
* Important Methods:
  * put()
  * get()
  * remove()

#### Events

* Event objects on the heap contain the patient, the time he will finish a resource, and the node id and resource id.
* Attributes:
```python
    self.patient_id = patient_id
    self.event_time = event_time # when the event finishes
    self.node_id = node_id
    self.node_resource_id = node_resource_id
    self.moved_to = None # where the event moved to
    self.in_queue = True # which queues it's in
    self.finished = False
```


#### Rules
* Rules are restrictions that a patient must adhere to to either be allowed inside a node, or a resource or both. Values for
them are specified inside the CSV, where each patient can have different values for different rules, i.e: if it's a FrequencyRule[see blow], patient A can visit node 3, 4 times, whilst patient B can only visit 1 time.
* There are two categories of rules: NodeRules and ResourceRules.
	* NodeRules apply to a node object, and include FrequencyRules and PredictionRules.
	These are rules that a patient must satisfy in order to be allowed inside a node
    (where he can occupy a queue or a resource). If patient fails any of the rules
    then the patient is not admitted into the process.
      * A node with a FrequencyRule can be visited multiple times by a patient
      on a case to case basis (i.e. each patient will visit a different number of times). 
      FrequencyRule objects keep track of which column in the patients csv file 
      the program has to read from in order to see how many times a patient has to reenter a node.
      * A node with a PredictionRule has a conditional patient admittance behaviour. For example, a
      patient can be predicted to require a scan, so they can be preemptively added to the waiting queue
      before being seen by the doctor.
    * ResourceRules: A resource may have a rule which will be used to decide whether the patient is allowed in or not, i.e
    can patient P go to doctor A, can patient P go to X-ray 2? If a node allows him in, but a resource rejects the patient, the patient will instead be inserted in another resource, one for which he passes all of the rules.
      * FirstComeFirstServeRule: This rule is used in conjuction with a PredictionRule on the Node, for cases when a patient will
      visit a node N multiple times. When this rule is used, if a patient goes to resource C, any time in the future when he needs to
      visit the same node N, he is only allowed inside resource C. This is particularly useful for cases like the Most Responsible Doctor, where if patient is first seen by doctor C, he will only go back to doctor C, instead of other doctors, as that doctor is responsible for him. 
* Rules are created in the rule_creator_factory, that is called in create_queues, located in run.py. 
* RuleVerifier: has a method `pass_rules` where you pass a patient, and a set of rules, and return True only if the 
patient passes all of the rules for it. Used inside a Node to check if a patient passes all of the rules for the Node,
and to also check if a patient passes all of the rules for a resource.
* If you want to create a rule, define it in the rules directory in modules, and inside rule_creator_factory.py



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
    
 
