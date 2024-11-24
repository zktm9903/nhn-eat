#!/bin/bash

docker volume create nhn-eat-db
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=1234 -e TZ=Asia/Seoul -v nhn-eat:/var/lib/postgresql/data postgres:15.2-alpine
