# Emergency Room Simulation/Team 22

## Description 
 - Our application is an emergency room simulator which is highly configurable and can simulate a broad range of scenarios.
 - It can be used by medical professionals/researchers to determine bottlenecks and areas in the emergency room which would benefit most from added resources.

 <!-- * What is the problem you're trying to solve? -->
 - We want to provide medical professionals and researchers with a way to visualize the impact of workflow changes in the emergency room.
 - In doing this, we also assist in solving the problem of resource allocation in emergency rooms. To do this, our emergency room simulator provides users with high-level views, as well as detailed statistics on their specified emergency room, such that their decisions pertaining to resource allocation may be well informed.
 - In addition, our lightweight and easy-to-use application allows researchers to test the efficiency of hypothetical hospital workflows. This would not be feasible in a real working environment since it would require overwhelming amounts of hospital downtime in order to add and rearrange processes in the hospital.

 <!-- * Is there any context required to understand **why** the application solves this problem? -->
 - In the waiting room of a hospital, each patient has an arrival time and a specific acuity (severity of condition). The user can specify the order of patients that leave the waiting queue based on each patient's acuity and arrival time. Our application uses multiple queue structures (e.g. stack, priority queue) in order to meet the user expectations.
 - Our application also uses statistical distributions to simulate the random variations in the amount of time a patient requires to receive treatment, as opposed to simpler models which assume patients always take the same time. This allows our model to be more accurate and more effectively represent reality.

## Key Features
 <!-- * Describe the key features in the application that the user can access
 * Feel free to provide a breakdown or detail for each feature that is most appropriate for your application -->
 * Visual Representation of the emergency room: Users can create circles representing hospital stations(e.g. reception, triage, patient-doctor interaction, x-ray machine) and create paths between those circles to represent the ability for patients to go between stations. The positions of patients are represented by queues(e.g. lineups) at each station.
 * Data Input: Users input data regarding patients' medical state and required medical operations(e.g. a visit to the x-ray, or a talk with a doctor). Users also input the estimated wait times and number of "actors" (e.g. doctors) at each station, such that patients can queue for stations realistically. The behavior of the given patients, as well as their interactions with the hospital stations will be simulated. Another point of input is the rules by which patients are selected from the queue for a given station, e.g. one station may choose to select patients based on acuity, and another station may choose to select patients based on arrival time.
 * Data Output: Events in the emergency room (e.g. a patient going from the X-ray machine to a doctor), and other statistics (e.g. actual wait times) are all recorded and saved.
 
### Snapshot of Terminal after running ```docker-compose up --build``` and the image has finished being built and the application is running 

 ![Snapshot of Terminal after running docker-compose up --build](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/ServerStarting.png)
### Home page

 ![Home page](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/homepage.png)
### Result of clicking on a Node

 ![Result of clicking on a Node](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/nodeexpanded.png)
### JSON of hospital layout entry page

![JSON entry field](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/jsonentry.png)
### After starting simulation logs

 ![After starting simulation logs](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/logsduringexecution.png)
### Statistics being send on Websockets at end of simulation

![Statistics being send on Websockets at end of simulation](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/statistics.png)


## Instructions
 <!-- * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * If you cannot deploy your application for technical reasons, please let your TA know at the beginning of the iteration. You will need to demo the application to your partner either way. -->
### Step 1 : Install docker based on the OS you have - Note: the website directs you to the correct version you need 
* [Docker](https://www.docker.com/products/docker-desktop)
And then start the docker application by double clickling it on your Applications section in your 
file explorer. You can verify it is running by finding a small icon near the icons tabs (on Mac OS there will be a icon of the docker logo that when you click it says "running") and similarly on Windows except this will be on the bottom navigation bar.

### Step 2 :
Run ```docker-compose down``` - in case you already have docker and have something running on the same port
Then run ```docker-compose up --build``` - to build the image/run the application
  - The client and server services will be instantiated with the ports indicated in the .env file.
  - The client can be accessed at http://localhost:5000 by default.

Note: you do not have to worry about any other setup either than ensuring you have docker on your device, 
In the event that you have issue because of conflicting ports you can change the value of the below port
varaibles in the env file (which is located at the root of the repository)
```
APP_SERVER_PORT={Backend port number - currently 8000}
REACT_APP_PORT={Frontend port number - currently 5000}
DEV_ENV=development
WEB_SOCKET_PORT={WSS port number - currently 8765}
```
### Step 3:
- Once the application begins (ie your terminal looks the same as the image above showcasing what the terminal should like once the application has finished building and has started), go to http://localhost:5000 or another port - based on REACT_APP_PORT that you have in your .env file. Then the user will be presented a blank canvas where they can create their workflow using different click operations.
  - Users who have used the application before may choose to upload a saved canvas file to quickly load a previously used workflow.
  - Hospital processes (e.g. reception, triage, scans) can be made by simply clicking on the canvas.
  - Clicking a process will allow the user to edit its properties and values.
  - To specify the processes to which the patient will travel, press and hold the shift key and click the outbound process followed by the inbound process.
- Once a user finishes creating the workflow, they can choose to save the layout into a file for future use, before uploading a csv file for the patient information.
- After the patient csv file is loaded, the simulation can start.
- As the simulation runs, the user can click on a process and see the number of patients currently in the queue for that process. The number of patients in each acuity will also be displayed.

## Customizing ports

The defaults for ports are indicated as such:

The backend APIs are at port 8000 indicated by APP_SERVER_PORT in the .env file.
The client host port is 5000 indicated by REACT_APP_PORT in the .env file.

The values of the ports can be customized simply by changing the value in the .env file.

This can be used to test our simulation's API to view the final statistics without having to run the frontend since our frontend limitation is that you would have to run the entire visualization before getting the statistic results.
Also customizable in case the port on the user's computer is already in use by a seperate application.

To switch from development to production change:

```
DEV_ENV=development
```

to 

```
DEV_ENV=production
```

Development environment has the following features:
- Backend:
  - Activates the debugger 
  - Activates the automatic reloader
  - Enables the debug mode on the Flask application.
- Frontend:
  - Activates hot reloading.
  - Directly serves files.
