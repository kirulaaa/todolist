FROM public.ecr.aws/lambda/nodejs:24 AS builder

# Working directory (where Node will install dependencies)
WORKDIR /var/task

# Copy dependency file (package.json)
COPY package.json /var/task/

# Install dependencies
RUN npm install

# RUNTIME (Production Image)
FROM public.ecr.aws/lambda/nodejs:24 AS runtime

# Working directory (where Node will install dependencies)
WORKDIR /var/task

# Set Node environment
ENV NODE_ENV=production
ENV PORT=3001

# PORT for AWS Web Adapter to listen from
ENV AWS_LWA_PORT=3001

# Copy all my backend source code & dependecies
COPY --from=builder /var/task/node_modules ./node_modules
COPY . /var/task/

# Lambda Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/aws-lambda-web-adapter

#Expose your port to Docker Engine or Container Engine
EXPOSE 3001

# Run backend
CMD ["index.handler"]

