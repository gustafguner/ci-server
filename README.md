# Continuous Integration Server

Implements a small continuous integration (CI) server that supports compilation of commits, execution of automated tests and notification of CI results.

## Description

This project focuses on implementing a continuous integration (CI) server that supports three main features: compilation, automated test execution and notification. More specifically, the CI server should be able to compile the commits that were pushed to the server as well as execute any automated tests. Furthermore, the CI server should notify the client of the results by a commit status; possible check statuses are *passing*, *pending* or *failing*. More information on the implementation of these features and how they were tested are covered in the sections below. 

The aim of this project is to master the core of continuous integration by implementing a small CI server, which was an assignment given by the course DD2480 Software Engineering Fundamentals. 
 
Currently, these are the language(s) that the CI server can compile:

* [Java](https://docs.oracle.com/en/java/)

Currently, these are the testing framework(s) that the CI server can execute:

* [JUnit](https://junit.org/junit4/)

### Build Status

Insert Build Status for the system.

### Compilation

Description of the implementation and unit tests of the CI server's compilation feature.

### Test Execution

Description of the implementation and unit tests of the CI server's test execution feature.

### Notification

Description of the implementation and unit tests of the CI server's notification feature.

## Getting Started
Please follow the install guides to set up the environment for this system: 

* [Node.js](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
* [mLab](database_service)
* [MongoDB](database)
* [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

Note that a GitHub account is required for the next steps; how to create an account can be found [here](https://help.github.com/articles/signing-up-for-a-new-github-account/). Once an account has been set up, the user will be able to get a working copy of the existing Git repository with the following commands:

for Linux:

```shell
$ cd /home/user/my_project
```

for Windows:

```shell
$ cd /c/user/my_project
```

for macOS:

```shell
$ cd /Users/user/my_project
```

and type: 

```shell
$ git clone https://github.com/gustafguner/fundamentals-lab2.git
```

There should now be a working copy of the repository available on your local machine.

### Prerequisites
* Node.js version 10.0.0 or greater
* NPM version 5.6.0
* Yarn version 1.13.0
* TypeScript version 3.3.1 or greater
* Mongodb version 4.0.5 or greater

See section [Built With](#built-with) for more details on the tools.

## How to Run

Description of how a client would be able to run/use the system.

## For Development
This section is aimed for individuals that wish to develop on the CI server itself. The following sections describes how to set up the development environment and how tests on the system can be run. 

### Set up

For the CI-server to gain access to your GitHub account you must generate a Personal Access token. Follow these steps to do so.

1. Log in to your GitHub account
2. Go to Settings > Developer Settings > Personal access tokens
3. Click `Generate new token`
4. Write a token description and check the `repo:status` box
5. Click generate token and copy the generated token

Create a file named `.env` located in the repository root folder containing

```shell
GITHUB_TOKEN="your-token-goes-here"
```

Once the environment has been set up and you have a working copy of the system (if not, see [Getting Started](#getting-started)) then follow these steps to start running the system and monitoring changes to the server:

1. Go into the CI server directory and start to monitor the changes with the following commands:

```shell
$ yarn
$ yarn watch
```
You should get something like this:

![yarn](https://github.com/gustafguner/fundamentals-lab2/blob/issue/6/yarn-example.png)

2. Create or go into a "test" repository that you wish to test the CI server on and type the following command.

```shell
$ ngrok http 3000
```

You should then see something like this:

![ngrok](https://github.com/gustafguner/fundamentals-lab2/blob/issue/6/ngrok-example.png)

Note that the compilation and test execution on the CI server only works for certain languages and frameworks. See [Description](#description) for more information.

3. Copy the URL (it should end with `.io`, e.g. `https://56b3bb3f.ngrok.io`) and go into the working repository in GitHub.

4. Click on `Settings` > `Webhooks` > `Add webhook`

5. Paste the copied URL in `Payload URL` appended with `/ci` (e.g. `https://56b3bb3f.ngrok.io/ci`). 

6. In `Content type` choose `application/json`.

7. Finish by clicking on the `Add webhook` button.

If everything is working correctly then whenever a Pull Request is made to the repository in GitHub, the CI server should be able to compile the code, execute tests and notify the results. 

### Running Tests

Description of how to run the automated tests on the system.

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript Engine.
* [Express.js](https://expressjs.com/) - Web application framework.
* [mLab](https://mlab.com/) - Cloud database service that hosts MongoDB databases.
* [Yarn](https://yarnpkg.com/en/) and [NPM](https://www.npmjs.com/) - Package managers.
* [TypeScript](https://www.typescriptlang.org/) - Open-source programming language.
* [MongoDB](https://www.mongodb.com/) -  NoSQL database.

## Contributing

See [workflow.md](https://github.com/gustafguner/fundamentals-lab2/blob/master/workflow.md) for details on the process for submitting pull requests to us.

See the list of [contributors](https://github.com/gustafguner/fundamentals-lab2/graphs/contributors) who participated in this project.

## Authors
* **Vera Blomkvist Karlsson** - [verakar](https://github.com/verakar)
* **Gustaf Gunér** - [gustafguner](https://github.com/gustafguner)
* **Adibbin Haider** - [adibbin](https://github.com/adibbin)
* **Sasha Hellstenius** - [sashahe](https://github.com/sashahe)
* **Emelie Tham** - [EmelieTham](https://github.com/EmelieTham)

