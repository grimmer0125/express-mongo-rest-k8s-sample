# Express Mongo Rest K8s Sample

Features:
- Add Kubernete settings to deploy to Google Kubernetes Engine and it is easily to deploy to AWS, Azure. It is portable.   
- Kubernete features used in this project:
    - Auto heal (which auto-restart crashed servers)
    - Load balance for web (API) server (2 VM nodes with 2 K8s pods setup)
    - Service discovery (Node.js <-> MongoDB)
- API documents generated from comments.   
- Convenient Testing or Playing. For example,
    - Use Postman (UI) by importing the shared collection
    - Use `jest` (Command line) to run unit tests locally.
    - Use Docker to test quickly.
- An Restful API example for a key-value storage. Directory structure & partial setting (e.g. apidoc, [query string utility](https://github.com/diegohaz/querymen)) is borrowed from [generator-rest](https://github.com/diegohaz/generator-rest). Each **API endpoint** has its own folder, containing model, controller, router and test flies.
- Use ES6 module system (import, export) via Babel.
- Use MongoDB ODM library: Mongoose.
- Add Convenient debugging setting via [Visual Studio Code](https://code.visualstudio.com/), using debugger with breakpoints for codes and tests !!
- Add [debug](https://www.npmjs.com/package/debug) module to define log levels

## Links

- API Endpoint on Google Cloud: https://vdapi.grimmer.io/vdobject
- API Online Doc: https://grimmer.io/apidoc/. Markdowm version: [DOCS](DOCS.md)
- Postman collection link for testing: https://www.getpostman.com/collections/59c285c7d01bcc3f147e

## Development

This is developed on macOS but should work well on other platforms.

### Prerequisites & environment setup

Install first:
- Node (v8+) & [Yarn](https://yarnpkg.com/en/) instead of npm. Yarn is much faster.
- [Docker](https://docs.docker.com/install/#supported-platforms) (optional): used to depoly K8s cluster and run MongoDB locally.

Install Node.js module dependencies:
`yarn install`

### Dev: Node (yarn start) + dockerized MongoDB

Alternatively, you can install native MongoDB binary.

1. Launch MongoDB: `docker run -p 27017:27017 -d --name mongo mongo:4.0.2`
2. Launch current program: `yarn start` or `yarn dev` (which prints debug logs and use live build+launch via `nodemon`)
3. Use unit test/any other client (e.g. curl/postman/python/go) to test server.

**Choose VS Code different debug launch setting to have advanced debugging**

### Dev: use Docker to test/play everything

1. Build docker image for current Node.js program: `docker build -t ANY_DOCKER_IMAGE_NAME_YOU_WANT .`

2. Run Node.js program with MongoDB:

```
docker run -it --rm -p 3000:3000 --link mongo:mongo -e "MONGODB_URI=mongodb://mongo/express-rest" ANY_DOCKER_IMAGE_NAME_YOU_WANT
```

### Run Tests

Just execute `yarn test`. You don't need to launch MongoDB by yourself since the tests use [MongodbMemoryServer](https://github.com/nodkz/mongodb-memory-server) which is recommended by [jest](https://jestjs.io/docs/en/mongodb) and will launch a special MongoDB instance by itself.

p.s. keep in mind that you many encounter some unexpected test results when you use VS Code to debug the tests with some breakpoints, there are some async-issue. If this happens, just use console (`yarn test`) to check it again.

## Deployment Kubernetes on Google

It uses K8s ver. 1.9.7-gke.6 and steps:

1. Do the first few steps of https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
    1. Create or select a project of [Google Kubernetes Engine](https://console.cloud.google.com/projectselector/kubernetes?_ga=2.131589903.-180865399.1536996773&_gac=1.49154772.1537804457.Cj0KCQjwlqLdBRCKARIsAPxTGaVEvNx4RkTjsIG58GFcdH7BjY_GSF9qJ7KyTO2ZeVgUaYoaW_kqUbkaAkKxEALw_wcB) page and enable its [billing](https://cloud.google.com/billing/docs/how-to/modify-project).
    2. Tool: 
        1. Use [Google Cloud Shell](https://cloud.google.com/shell). **OR** 
        2. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts), which includes the `gcloud` command-line tool. Install kubectl (`gcloud components install kubectl`), [Docker](https://docs.docker.com/engine/installation/).
    3. Set defaults (project, compute/zone)for the gcloud: 
        ```
        gcloud config set project PROJECT_ID`, 
        gcloud config set compute/zone us-central1-b` 
        ```
2. Create a K8s cluster, `gcloud container clusters create my-first-cluster --num-nodes=2 --disk-size 10`, after creating, the  `kubectrl` will switch to the cluster.
3. Create MongoDB K8S service for the current cluster, `kubectl create -f mongo-service.yaml`
4. Create a Google compute disk for MongoDB, `gcloud compute disks create --size=2GB -zone "us-central1-b" mongo-disk`
5. Create MongoDB single pod (no replicate) `kubectl create -f mongo-controller.yaml`
6. (optional) Create a static public domain name, `gcloud compute addresses create apiweb-ip --region us-central1`, ref: https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip
7. (optional) Get `address` part from the output of `gcloud compute addresses describe apiweb-ip --region us-central1`
8. (optional) Modify `loadBalancerIP` field in `web-service.yaml`. You can ignore these 3 steps (and remove this field) to use non-static externalIP, which means your exposed IP of web service may change due to any reasons, e.g. you upgrade google K8S cluster version from its web dashboard.
9. Create web K8S service, `kubectl create -f web-service.yaml`
10. Build a new docker image for the latest code, `docker build -t grimmer0125/express-mongo-rest-sample .`, you can choose other docker image but you need the `- image:` of `web-controller` to yours.
11. Upload this docker image to Docker Hub or Google Docker registry.
12. Create web-controller pod `kubectl create -f web-controller.yaml`.

Check if the pods work
- `kubectl get pods` or `kubectl get service` or Google Kubernetes Web Dashboard.

Then use `static public domain name` to test.

p.s.

You many ignore region/zone options (e.g. `-zone us-central1-b`) in some commands since you setup default region in the 1st step. (e.g. `gcloud config set compute/zone us-central1-b`)

Some flow are referenced from https://github.com/kubernetes/examples/tree/master/staging/nodesjs-mongodb whose setting can not directly be applied since it is outdated.

`grimmer0125/express-mongo-rest-sample` is omitting docker registry field so it is for Docker Hub. `gcr.io/my-project/hello-app` includes the registry so it is specifying to Google's.

### How to upgrade web service

For example: `kubectl set image deployment/web-controller web=grimmer0125/express-mongo-rest-sample:0.9`

### Stop or add more running K8s (Web-Controller) pods

`kubectl scale deployment web-controller --replicas=n`, n = 0 for stop.

### Other gcloud commands & tips

- gcloud auth login
- gcloud projects list
- gcloud compute zones list
- gcloud compute instances list
- gcloud container clusters list
- gcloud container clusters get-credentials cluster_name

## Deployment Local Kubernetes cluster - minikube

Install minikube: https://github.com/kubernetes/minikube#installation, it is minikube version: v0.28.2 now and uses K8s v1.10.0 by default, 201809.

Run minikube which launches a VM: `minikube start`.

Setup & run local K8s cluster:
1. `kubectl create -f mongo-service.yaml`
2. `kubectl create -f mongo-controller-minikube.yaml` (You don't need to setup Google compute disk for MongoDB.)
3. `kubectl create -f web-service-minikube.yaml` (Remove `loadBalancerIP`)
4. `kubectl create -f web-controller.yaml`

`kubectl get service` will output `EXTERNAL-IP` is `<pending>` and it is OK. Type `minikube service web --url` will get the final URL we can use, e.g. `http://192.168.99.100:30778`

Use this url to test the API endpoint, `http://192.168.99.100:30778/vdobject`.

Stop steps:
1. `kubectl delete service mongo`
2. `kubectl delete service web`
3. `kubectl delete deployment mongo-controller`
4. `kubectl delete deployment web-controller`
3. `minikube stop`

Use `minikube status` to check its status.

### Some K8s commands & tips

* `kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.4 --port=8080` use command to create a deployment, instead of using `kubectl create -f xx.yaml`.
* `kubectl expose deployment hello-minikube --type=NodePort` use command to create a service.
* use `kubectl config get-contexts` & `kubectl config use-context CONTEXT_NAME` to switch the current working cluster among differenct google clusters and minikube for `kubectl`
* `kubectl logs`
* `kubectl get <podname>` (check status)
* `kubectl describe <podname>` (to check create errors)
* `kubectl get endpoints mongo` (check if a service selects some pods successfully), from https://kubernetes.io/docs/tasks/debug-application-cluster/debug-service/
* `kubectl get all`

`selector` field in K8s (e.g. `web-service.yaml`) means it selects other resources to use by this label filter.

## Backlog

- Add authenticaion.
- Monitoring & Logs Tools Setup (e.g. Google Stackdriver, AWS Cloudwatch)
- Use Golang + [Locust](https://locust.io/) + K8S to write stress test,
- Publish to other cloud (e.g. AWS, Azure)
- CI, CD and rolling update of Kubernetes
- ~~Fix minikube (Kubernetes local version) issue, failing to deply locally.~~
- Improve MongoDB setup (e.g. add password, indexe, replica set)
- Use other Database.
- Add [TypeScript](https://www.typescriptlang.org/) to have offline compilation, static type checking and so on
