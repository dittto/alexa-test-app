# How to build an Alexa app

## First steps:
Update `etc/aws.config` and `etc/aws.credentials` for serverless to run correctly. These files are copies over using docker. If you don't use the docker setup, then make sure aws-cli is setup correctly on your local system.
          
This code comes with a docker file for testing. You need to run:
```bash
docker-compose up -d --build
docker exec -it alexa-test bash
npm install
```

To test, run:
```bash
serverless invoke local --function alexaTest --path lib/01-initial-request.json
```

To deploy, run:
```bash
serverless deploy
```