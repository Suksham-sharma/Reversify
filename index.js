const http = require("http");
const express = require("express");
const Docker = require("dockerode");

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const mangementApi = express();

mangementApi.use(express.json());

mangementApi.post("/containers", async (req, res) => {
  const { image, tag = "latest" } = req.body;
  let imageAlreadyExists = false;

  const images = await docker.listImages();

  for (const systemImage of images) {
    for (const systemTag of systemImage.RepoTags)
      if (systemTag === `${image}:${tag}`) {
        imageAlreadyExists = true;
        break;
      }
    if (imageAlreadyExists === true) break;
  }

  if (!imageAlreadyExists) {
    console.log(`Pulling Image: ${image}:${tag}`);
    await docker.pull(`${image}:${tag}`);
  }

  const container = await docker.createContainer({
    Image: `${image}:${tag}`,
    Tty: false,
    HostConfig: {
      AutoRemove: true,
    },
  });

  await container.start();

  return res.json({
    status: "active",
    container: `${(await container.inspect()).Name}.localhost`,
  });
});
