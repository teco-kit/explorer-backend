# Explorer Backend
The backend part of the explorer project which can be found [here](https://github.com/teco-kit/explorer/blob/master/README.md).

![Tests](https://github.com/teco-kit/explorer-backend/workflows/Tests/badge.svg?branch=master)

A REST API for the Explorer backend. 

You can find an UML for the database scheme 
<a href="https://drive.google.com/open?id=15c_GufI5fqn6T1DA8TLKNCUdbo4u7VCh">here</a>.

# Getting started
Before you get started clone *this repository* and the <a href="https://github.com/teco-kit/explorer-auth">authentication repository</a>
and make sure, both repositories are located in the same folder.

You can either run the application within a docker container or directly.

## Development
If you want to run the application locally, please follow the 
<a href="https://docs.mongodb.com/manual/installation/">mongoDB installation guide</a>.

Please make sure mongoDB and <a href="https://github.com/teco-kit/explorer-auth">Explorer authentication</a>
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

