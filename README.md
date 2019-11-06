# REST API for AURA Backend
A REST API for AURA backend. 

You can find an UML for the database scheme 
<a href="https://drive.google.com/open?id=15c_GufI5fqn6T1DA8TLKNCUdbo4u7VCh">here</a>.

# Getting started
Before you get started clone *this repository* and the *authentication repository* 
and make sure, both repositories are located in the same folder.

You can either run the application within a docker container or directly.

## Installing docker
Please follow the instructions to install <a href="https://docs.docker.com/install/"> 
docker</a> and <a href="https://docs.docker.com/compose/install/">install docker-compose</a>.

Then run the following command to build the images and to pull the mongoDB image.

```
sudo docker-compose build

```

Running the following command will start the dockerized application on your local machine:

```
docker-compose up

```

## Development
If you want to run the application locally, please follow the 
<a href="https://docs.mongodb.com/manual/installation/">mongoDB installation guide</a>.

Please make sure mongoDB and <a href="https://docs.mongodb.com/manual/installation/">Aura authentication</a>
is up and running.

Then run the following commands:
                                                                     
```
npm install
npm run start
```

# Testing
After developing and **before** committing, please make sure all test are passing. MongoDB and Aura Authentication
need to be up and running.

```
npm run test
```

