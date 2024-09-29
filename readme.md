# Reverse Proxy for Docker Containers

## What are we building?

We are creating our own **dynamic reverse proxy** similar to [Traefik](https://traefik.io/). This project serves as a learning exercise to better understand Docker networking and reverse proxy management.

## Tools Used:

- **Node.js** / **Express.js**
- **Ports**:
  - **8080**: Management API for starting, stopping, and listening to containers.
  - **80**: For reverse proxy routing.

## What is a Reverse Proxy?

A reverse proxy sits between the client and backend servers, routing client requests to the appropriate server. In environments with multiple servers, it is necessary to manage which server should handle a given request. A reverse proxy like Nginx or Traefik can use load-balancing algorithms, such as Round Robin, to distribute the traffic.

In simpler terms:

- The reverse proxy intercepts requests from the client.
- It forwards them to one of the backend servers based on predefined rules or dynamic routing.

## Docker Reverse Proxy

In a Docker environment, a reverse proxy helps in routing traffic between multiple running containers. Typically, you would need to manually configure ports when adding or removing containers, but with a dynamic reverse proxy, this can be done automatically.

Traefik, for example, updates its routing configuration dynamically as containers are added or removed, saving manual effort.

## Short Note on Docker Networking

Let's explore a simple use case with Docker networking.

Running an Nginx container:

```bash
docker run -d nginx
```

This command runs a container but it won’t be accessible from your host machine as it operates inside Docker's virtual network, with port 80 being private to the container.

To expose the port:

```bash
docker run -d -p 8080:80 nginx
```

In this case, port 8080 on the host machine is mapped to port 80 of the Nginx container, allowing access from the host.

### Problem: Managing Multiple Containers

If you have multiple Nginx containers:

```bash
docker run -d -p 8080:80 nginx
docker run -d -p 8081:80 nginx
```

Managing and remembering the ports of multiple containers quickly becomes cumbersome, especially as the number of containers grows.

## Enter Traefik

Traefik solves this by automatically managing the routing for multiple containers. You only need to start a Traefik container, and it will handle the rest.

- Start a Traefik container and map it to port 80.
- Spin up any number of containers and Traefik will dynamically route traffic to them without manual intervention.

For example, if you spin up two containers named `nginx1` and `nginx2`, Traefik will create subdomains for both:

- `nginx1.docker.localhost`
- `nginx2.docker.localhost`

You can now access them via these subdomains without needing to expose individual ports, enhancing security and simplifying management.

## Benefits of using Dynamic Reverse Proxy

- **Dynamic Routing:** Automatically configures routes when containers are added or removed.
- **Enhanced Security:** Containers are accessed via Traefik, not directly via exposed ports.
- **Ease of Use:** Reduces manual effort when managing a large number of containers.
