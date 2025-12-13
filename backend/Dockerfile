FROM public.ecr.aws/docker/library/node:lts-alpine AS builder

# Working directory (where Node will install dependencies)
WORKDIR /var/task

# Copy dependency file (package.json)
COPY package.json /var/task/

# Install dependencies
RUN npm install

# RUNTIME (Production Image)
FROM public.ecr.aws/docker/library/node:lts-alpine AS runtime

# Working directory (where Node will install dependencies)
WORKDIR /var/task

# Copy all my backend source code & dependencies
COPY --from=builder /var/task/node_modules ./node_modules
ADD . /var/task

# Lambda Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# Expose your port to Docker Engine or Container Engine
EXPOSE 8080

# Run backend
CMD ["node", "server.js"]