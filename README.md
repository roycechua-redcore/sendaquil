# cyndaquil
## Your First App

This app displays the name of the requester of a freshdesk ticket in the ticket_sidebar placeholder

### Files and Folders
    .
    ├── README.md                 A file for your future self and developer friends to learn about app
    ├── app                       A folder to place all assets required for frontend components
    │   ├── index.html            A landing page for the user to use the app
    │   ├── scripts               JavaScript to place files frontend components business logic
    │   │   └── index.js
    │   └── styles                A folder to place all the styles for app
    │       ├── images
    │       │   └── icon.svg
    │       └── style.css
    ├── config                    A folder to place all the configuration files
    │   └── iparams.json
    └── manifest.json             A JSON file holding meta data for app to run on platform

Explore [more of app sample codes](https://github.com/freshworks/marketplace-sample-apps) on the Freshworks github respository.


## Pre-requisities
---
Make sure that you have installed Node.js on your machine. Refer to the official Freshdesk instructions here [https://developer.freshdesk.com/v2/docs/quick-start/](https://developer.freshdesk.com/v2/docs/quick-start/) for more details.


## Setup
---
Run the command below using npm to locally setup the babel compiler and utility scripts to speed up your workflow.
``` bash
npm install 
```


## How to Run
---
To run the project run the command below using npm to pre-compile any React components using babel and run the freshdesk application on your local machine.
```
npm run start
```


## Deploy
---
To prepare a package for deployment run the command below using npm
```
npm run deploy
```


## Notes
---
We can recompile the React Components using the babel commands to avoid additional latency in rendering the web application.

```bash
$ npx babel ./app --out-dir ./app/build --presets react-app/prod
```

The --watch argument can be passed for development purposes to avoid having to stop the entire project then rebuild. 

```bash
$ npx babel --watch ./app --out-dir ./app/build --presets react-app/prod
```