# Express Mongo Rest K8s Sample

Features:
- Use Kubernete settings to deploy to Google Kubernetes Engine and it is easily to deploy to AWS, Azure. It is portable.   
- Kubernete features used in this project:
    - auto heal
    - load balance
    - service discovery
- API documents generated from comments.   
- Convenient Testing or Playing. For example,
    - Use Postman (UI) by importing the shared collection
    - Use `jest` (Command line) to run unit tests locally.
    - Use Docker to test quickly.
- An Restful API example for a key-value storage. Folder structure is borrowed from [generator-rest](https://github.com/diegohaz/generator-rest)
- Use MongoDB ODM library: Mongoose.
- Convenient debugging setting via Visual Studio Code, using debugger with breakpoints for codes and tests !!

## Links

- API Endpoint on Google Cloud: https://vdapi.grimmer.io/vdobject
- API Online Doc: https://grimmer.io/apidoc/. Markdowm version: [DOCS](DOCS.md)
- Postman collection link for testing: https://www.getpostman.com/collections/59c285c7d01bcc3f147e

## Development

This is developed on macOS but should work well on other platforms.

### Prerequisites & environment setup

Install first:
- Node (v8+) & [Yarn](https://yarnpkg.com/en/) instead of npm.
- Docker (optional): used to depoly K8s cluster and run MongoDB locally.

Install Node.js module dependencies:
`yarn install`

### Dev: Node (yarn start) + dockerized MongoDB

Alternatively, you can install native MongoDB binary.

1. Launch MongoDB: `docker run -p 27017:27017 -d --name mongo mongo:4.0.2`
2. Launch current program: `yarn start` or `yarn dev` (live build and launch via `nodemon`)
3. Use unit test/any other client (e.g. postman/python/go) to test server.

**Choose VS Code different debug launch setting to have advanced debugging**

### Dev: use Docker to test/play everything

1. Build docker image for current Node.js program: `docker build -t ANY_DOCKER_IMAGE_NAME_YOU_WANT .`

2. Run Node.js program with MongoDB:

```
docker run -it --rm -p 3000:3000 --link mongo:mongo -e "MONGODB_URI=mongodb://mongo/express-rest" ANY_DOCKER_IMAGE_NAME_YOU_WANT
```

### Tests

`yarn test`

## Deployment - Kubernetes

Complement later.

## Backlog

- Add authenticaion.
- Monitoring & Logs Tools Setup (e.g. Google Stackdriver, AWS Cloudwatch)
- Use Golang to write stress test
- Publish to other cloud (e.g. AWS, Azure)
- CI & CD.
- Fix minikube (Kubernetes local version) issue, failing to deply locally.
- Improve MongoDB setup (e.g. add password and indexes)
