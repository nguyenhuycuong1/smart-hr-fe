# Angular Docker Setup

This document explains how to use Docker and Docker Compose with the Smart HR Frontend application.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Files Overview

1. **Dockerfile**: Defines the build process for the Angular application
2. **docker-compose.yml**: Sets up the container environment
3. **nginx.conf**: Custom configuration for Nginx to properly serve the Angular app

## Building and Running

### Development Mode

```bash
# Start the application in development mode
docker-compose up
```

### Production Build

```bash
# Build the production image
docker-compose build

# Run the production container
docker-compose up -d
```

## Environment Configuration

The application uses the file at `src/assets/env.js` for runtime configuration. This file is mounted as a volume in the container, allowing you to change environment variables without rebuilding the image.

## Port Mapping

The application runs on port 4200 on your host machine and maps to port 80 inside the container:

- External: http://localhost:4200
- Internal: port 80

## Customization

You can customize the Docker setup by:

1. Editing the `nginx.conf` file for more specific Nginx configurations
2. Modifying the volumes section in `docker-compose.yml` for different file mappings
3. Adjusting the build arguments in the Dockerfile if needed

## Troubleshooting

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify network connectivity: `docker network inspect smart-hr-network`
3. Ensure all required files are properly mounted
