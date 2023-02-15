docker stop reactdockerapp
docker rm -f reactdockerapp

docker pull node:lastest

docker run -it --name reactdockerapp -p 3000:3000 -v "$PWD":/usr/src/app -w /usr/src/app --entrypoint bash node:latest