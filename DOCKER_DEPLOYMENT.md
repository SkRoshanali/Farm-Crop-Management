# Docker Deployment Guide

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
nano .env
```

### 2. Generate Secure JWT Secret

```bash
# Generate a secure 256-bit secret
openssl rand -base64 32
```

Copy the output and paste it into your `.env` file as `JWT_SECRET`.

### 3. Start All Services

```bash
# Build and start all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Access the Application

| Service  | URL                              | Description           |
|----------|----------------------------------|-----------------------|
| Frontend | http://localhost:3000            | React Dashboard       |
| Backend  | http://localhost:8080            | Spring Boot API       |
| Swagger  | http://localhost:8080/swagger-ui | API Documentation     |
| MySQL    | localhost:3306                   | Database (internal)   |

## Environment Variables

### Required Variables

```bash
# Database
DB_NAME=farm_crop_db
DB_USERNAME=farmuser
DB_PASSWORD=your_secure_password_here

# JWT (CRITICAL - Generate with: openssl rand -base64 32)
JWT_SECRET=your_256_bit_secret_key_here
JWT_EXPIRATION=86400000

# Application
SPRING_PROFILES_ACTIVE=prod
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Optional Variables

```bash
# Custom ports (if defaults conflict)
MYSQL_PORT=3306
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

## Docker Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Build and start
docker-compose up --build -d
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Execute Commands in Container

```bash
# Access backend container shell
docker-compose exec backend sh

# Access MySQL
docker-compose exec mysql mysql -u root -p

# Check backend health
docker-compose exec backend wget -qO- http://localhost:8080/actuator/health
```

## Production Deployment

### 1. Security Checklist

- [ ] Generate strong JWT secret (32+ characters)
- [ ] Use strong database password (16+ characters)
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Update CORS origins in SecurityConfig.java
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Review and update security headers

### 2. Production docker-compose.yml

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - farm-network
    restart: always
    # Don't expose port externally in production
    # ports:
    #   - "3306:3306"

  backend:
    image: your-registry/farm-backend:latest
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_URL: jdbc:mysql://mysql:3306/${DB_NAME}?useSSL=true&requireSSL=true
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION}
    depends_on:
      - mysql
    networks:
      - farm-network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  frontend:
    image: your-registry/farm-frontend:latest
    depends_on:
      - backend
    networks:
      - farm-network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  # Add reverse proxy (nginx/traefik) for HTTPS
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - farm-network
    restart: always

volumes:
  mysql_data:
    driver: local

networks:
  farm-network:
    driver: bridge
```

### 3. Database Backup

```bash
# Backup database
docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u root -p${DB_PASSWORD} ${DB_NAME} < backup.sql

# Automated backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > backup_${DATE}.sql
# Keep only last 7 days
find . -name "backup_*.sql" -mtime +7 -delete
EOF
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait for healthcheck
# 2. Wrong DB_URL - should use 'mysql' hostname, not 'localhost'
# 3. Missing JWT_SECRET - check .env file
```

### Frontend can't connect to backend

```bash
# Check nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Check backend is accessible from frontend container
docker-compose exec frontend wget -qO- http://backend:8080/actuator/health

# Common issues:
# 1. Wrong network configuration
# 2. Backend not started
# 3. CORS issues - check SecurityConfig.java
```

### Database connection issues

```bash
# Test MySQL connection
docker-compose exec mysql mysql -u root -p${DB_PASSWORD} -e "SHOW DATABASES;"

# Check if database exists
docker-compose exec mysql mysql -u root -p${DB_PASSWORD} -e "USE farm_crop_db; SHOW TABLES;"

# Common issues:
# 1. Wrong credentials in .env
# 2. Database not created - check MYSQL_DATABASE env var
# 3. Connection string wrong - should use 'mysql' hostname
```

### Permission denied errors

```bash
# Backend runs as non-root user 'spring'
# Frontend runs as non-root user 'nginx'

# If you need to debug, temporarily run as root:
docker-compose exec -u root backend sh
docker-compose exec -u root frontend sh
```

### Out of memory

```bash
# Check container resource usage
docker stats

# Increase memory limits in docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 2G
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000/

# MySQL health
docker-compose exec mysql mysqladmin ping -h localhost -u root -p${DB_PASSWORD}
```

### Container Stats

```bash
# Real-time stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Note: You'll need a load balancer (nginx/traefik) in front
```

### Vertical Scaling

Edit `docker-compose.yml`:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '4'
        memory: 4G
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push images
        run: |
          docker build -t your-registry/farm-backend:latest ./backend
          docker build -t your-registry/farm-frontend:latest ./frontend
          docker push your-registry/farm-backend:latest
          docker push your-registry/farm-frontend:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/farm-crop-system
            docker-compose pull
            docker-compose up -d
```

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use secrets management** - Consider Docker Secrets or HashiCorp Vault
3. **Run as non-root** - Already configured in Dockerfiles
4. **Keep images updated** - Regularly update base images
5. **Scan for vulnerabilities** - Use `docker scan` or Trivy
6. **Limit container resources** - Prevent DoS attacks
7. **Use private registry** - Don't expose images publicly
8. **Enable TLS** - Use HTTPS in production
9. **Rotate secrets** - Change JWT secret and passwords regularly
10. **Monitor logs** - Set up centralized logging (ELK, Splunk)

## Performance Optimization

### Backend

```yaml
backend:
  environment:
    JAVA_OPTS: >
      -XX:+UseContainerSupport
      -XX:MaxRAMPercentage=75.0
      -XX:+UseG1GC
      -XX:+UseStringDeduplication
```

### Frontend

```nginx
# Enable gzip in nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database

```yaml
mysql:
  command: >
    --default-authentication-plugin=mysql_native_password
    --max_connections=200
    --innodb_buffer_pool_size=1G
    --innodb_log_file_size=256M
```

## Support

For issues and questions:
- Check logs: `docker-compose logs -f`
- Review SECURITY.md for security guidelines
- Check GitHub issues
- Contact: support@farmcrop.com
