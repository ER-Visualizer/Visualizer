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
 
### Snapshot of terminal after running ```docker-compose up --build``` where the image has finished being built and the application is running:

 ![Snapshot of Terminal after running docker-compose up --build](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/ServerStarting.png)
### Home page:

 ![Home Page](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/homepage.png)
### Result of clicking on a workflow activity:

 ![Result of Clicking on a Workflow Activity:](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/nodeexpanded.png)
### JSON of hospital layout:

![JSON entry field](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/jsonentry.png)
### Simulation logs after running application:

 ![Simulation logs after running application:](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/logsduringexecution.png)
### Statistics sent on websockets at end of simulation:

![Statistics being sent at the end of simulation](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/statistics.png)

## System Requirements for Windows

- Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later)
- Hyper-V and Containers Windows features must be enabled
  - This can be done by running the docker application after installing. The user will be prompted and required to restart the computer in order to finish the required setup.

- The following hardware prerequisites are required to successfully run Client Hyper-V on Windows 10:

  - 64 bit processor with [Second Level Address Translation (SLAT)](https://en.wikipedia.org/wiki/Second_Level_Address_Translation)
  - 4GB system RAM
  - BIOS-level hardware virtualization support must be enabled in the BIOS settings (see image).

   ![virtualization example](https://github.com/csc301-fall-2019/team-project-ml-simulation-vector-institute/blob/master/deliverables/virtualization-enabled.png)

## Installing and running Docker Desktop on Windows

- Double-click Docker Desktop Installer.exe to run the installer.

- If you haven’t already downloaded the installer (Docker Desktop Installer.exe), you can get it from Docker Hub. It typically downloads to your ```Downloads``` folder, or you can run it from the recent downloads bar at the bottom of your web browser.

- Follow the instructions on the installation wizard to accept the license, authorize the installer, and proceed with the install.

- When prompted, authorize the Docker Desktop Installer with your system password during the install process. Privileged access is needed to install networking components, links to the Docker apps, and manage the Hyper-V VMs.

- Click Finish on the setup complete dialog and launch the Docker Desktop application.

## System Requirements for Mac OS

- Mac hardware must be a 2010 or newer model, with Intel’s hardware support for memory management unit (MMU) virtualization, including Extended Page Tables (EPT) and Unrestricted Mode. You can check to see if your machine has this support by running the following command in a terminal: sysctl kern.hv_support

- macOS must be version 10.13 or newer. We recommend upgrading to the latest version of macOS.

- If you experience any issues after upgrading your macOS to version 10.15, you must install the latest version of Docker Desktop to be compatible with this version of macOS.

  Note: Docker supports Docker Desktop on the most recent versions of macOS. That is, the current release of macOS and the previous two releases. As new major versions of macOS are made generally available, Docker will stop supporting the oldest version and support the newest version of macOS (in addition to the previous two releases).

- At least 4 GB of RAM.

- VirtualBox prior to version 4.3.30 must not be installed as it is not compatible with Docker Desktop.

## Installing and running Docker Desktop on Mac
- Double-click Docker.dmg to open the installer, then drag the Docker icon to the Applications folder.

- Install Docker app

- Double-click Docker.app in the Applications folder to start Docker. (In the example below, the Applications folder is in “grid” view mode.)

  You are prompted to authorize Docker.app with your system password after you launch it. Privileged access is needed to install networking components and links to the Docker apps.

  The Docker menu in the top status bar indicates that Docker Desktop is running, and accessible from a terminal.


  If you just installed the app, you also get a message with suggested next steps and a link to the documentation. Click the Docker menu (whale
 menu) in the status bar to dismiss this pop-up notification.


- Click the Docker menu (whale menu) to see Preferences and other options.

- Select About Docker to verify that you have the latest version.

## Instructions 
 <!-- * Clear instructions for how to use the application from the end-user's perspective
 * How do you access it? Are accounts pre-created or does a user register? Where do you start? etc. 
 * Provide clear steps for using each feature described above
 * If you cannot deploy your application for technical reasons, please let your TA know at the beginning of the iteration. You will need to demo the application to your partner either way. -->
### Setup: Download the docker installer [here](https://www.docker.com/products/docker-desktop) and follow the docker setup instructions above. The website directs you to the correct version base on your OS
Then, start the application by double clicking the docker icon in your Applications folder.

### Running the Application:
Run ```docker-compose down``` - in case you already have docker and have something running on the same port
Then run ```docker-compose up --build``` - to build the image/run the application
  - The client and server services will be instantiated with the ports indicated in the .env file.
  - The client can be accessed at http://localhost:5000 by default.

Note: you do not have to worry about any other setup either than ensuring you have docker on your device.

In the event that you have issues due to conflicting ports, you can change the values of the following port variables in the env file (located at the root of the repository).
```
APP_SERVER_PORT = {Backend port number - default 8000}
REACT_APP_PORT = {Frontend port number - default 5000}
DEV_ENV = development
WEB_SOCKET_PORT = {WSS port number - default 8765}
```
### Using the Application:
- Once the application begins (your terminal should look the same as the image above), go to http://localhost:5000. If you are using another port - based on REACT_APP_PORT that you have in your .env file. Then, a blank canvas will be presented where the hospital workflow can be created using different click operations.
  - Users who have used the application before may choose to upload a saved canvas file to quickly load a previously used workflow.
  - Hospital processes (e.g. reception, triage, scans) can be made by simply clicking on the plus button. The user will then be prompted to enter the necessary properties of the process.
  - Clicking a process on the screen will allow the user to view and edit its properties.
  - To specify the processes to which the patient will travel, press and hold the shift key and click the outbound process followed by the inbound process.
- Once a user finishes creating the workflow, they can choose to save the layout into a file for future use, before uploading a csv file for the patient information.
- After the patient csv file is loaded, the simulation can start.
- As the simulation runs, the user can click on a process and see the number of patients currently in the queue for that process. The number of patients in each acuity will also be displayed.

## Customizing ports

The defaults for ports are indicated as such:

The backend APIs are at port 8000 indicated by APP_SERVER_PORT in the .env file.
The client host port is 5000 indicated by REACT_APP_PORT in the .env file.

The values of the ports can be customized simply by changing the value in the .env file.

This can be used to test our simulation's API to view the final statistics without having to run the frontend since our frontend limitation is that you would have to run the entire visualization before getting the resulting statistics.
This is also customizable in case the port on the user's computer is already in use by a separate application.

To switch from development to production, 

change

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
  - Activates hot reloading
  - Directly serves files
