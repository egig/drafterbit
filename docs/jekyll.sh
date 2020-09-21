# run jekyll docker on my local
docker run --rm \
  -p 4000:4000 \
  --volume="$PWD":/usr/src/app \
  -it starefossen/github-pages