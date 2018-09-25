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

### Run Tests

`yarn test`

## Deployment Kubernetes on Google

1. Setup K8s account, tool : follow https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app until `Set defaults for the gcloud command-line tool`.
2. Create a K8s cluster, `gcloud container clusters create dragon-cluster3 --num-nodes=2 --disk-size 10`, after creating, the  `kubectrl` will switch to the cluster.
3. Create MongoDB K8S service for the current cluster, `kubectl create -f mongo-service.yaml`
4. Create a Google compute disk for MongoDB, `gcloud compute disks create --size=2GB -zone "us-central1-b" mongo-disk`
5. Create MongoDB single pod (no replicate) `kubectl create -f mongo-controller.yaml`
6. Create a static public domain name, `gcloud compute addresses create apiweb-ip --region us-central1`, ref: https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip
7. Get `address` part from the output of `gcloud compute addresses describe apiweb-ip --region us-central1`
8. Modify `loadBalancerIP` field in `web-service.yaml`
9. Create web K8S service, `kubectl create -f web-service.yaml` 
10. Build a new docker image for the latest code, `docker build -t grimmer0125/express-mongo-rest-sample .`, you can choose other docker image but you need the `- image:` of `web-controller` to yours. 
11. Upload this dockre image to Dockerhub or Google Docker registry. 
12. Create web-controller pod `kubectl create -f web-controller.yaml`.

Check if the pods work
- `kubectl get pods` or `kubectl get service` or Google Kubernetes Web Dashboard. 

Then use `static public domain name` to test. 

`grimmer0125/express-mongo-rest-sample` is omitting docker registry field so it is for Dockerhub. `gcr.io/my-project/hello-app` includes the registry so it is specifying to Google's. 

### How to upgrade web service

For example: `kubectl set image deployment/web-controller web=grimmer0125/express-mongo-rest-sample:0.9`

### Stop or add more running K8s (Web-Controller) pods 

`kubectl scale deployment web-controller --replicas=n`, n = 0 for stop. 

### Other K8s commands & tips

- gcloud compute instances list
- gcloud container clusters list
- gcloud container clusters get-credentials cluster_name

`selector` field in K8s (e.g. `web-service.yaml`) means it selects other resources to use by this label filter. 

## Backlog

- Add authenticaion.
- Monitoring & Logs Tools Setup (e.g. Google Stackdriver, AWS Cloudwatch)
- Use Golang to write stress test
- Publish to other cloud (e.g. AWS, Azure)
- CI, CD and rolling update of Kubernetes
- Fix minikube (Kubernetes local version) issue, failing to deply locally.
- Improve MongoDB setup (e.g. add password and indexes)
