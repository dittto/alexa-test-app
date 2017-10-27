# How to build an Alexa app

// update etc/aws.config
          etc/aws.credentials
// for serverless to run correctly. These files are copies over using docker. If you don't use the docker setup, then make sure aws-cli is setup correctly on your local system.
          

// comes with a docker file for testing. Need to run:
// docker-compose up -d --build
// docker exec -it alexa-test bash
// npm install


// serverless invoke local --function alexaTest --path ../lib/01-initial-request.json
// serverless deploy