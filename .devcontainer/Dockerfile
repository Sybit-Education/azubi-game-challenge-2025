FROM mcr.microsoft.com/devcontainers/typescript-node:1-22

# Install additional global packages
RUN npm install -g npm@latest http-server

# Set up development environment
WORKDIR /workspaces/app

# Install Chrome for headless testing (if needed later)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    chromium \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=development
