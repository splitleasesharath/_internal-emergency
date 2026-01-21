# Deployment Guide

This guide covers deploying the Internal Emergency Management Dashboard to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Twilio account with SMS capability
- Slack workspace with webhook configured
- SMTP server access for emails
- Domain name (optional but recommended)

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create your-app-name
```

3. **Add PostgreSQL Database**
```bash
heroku addons:create heroku-postgresql:standard-0
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_jwt_key
heroku config:set TWILIO_ACCOUNT_SID=your_twilio_sid
heroku config:set TWILIO_AUTH_TOKEN=your_twilio_token
heroku config:set TWILIO_PHONE_NUMBER=+1234567890
heroku config:set SLACK_WEBHOOK_URL=your_slack_webhook
heroku config:set SLACK_BOT_TOKEN=your_slack_bot_token
heroku config:set SLACK_DYNAMIC_TASKS_CHANNEL=your_channel_id
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your_email@gmail.com
heroku config:set SMTP_PASS=your_app_password
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

5. **Deploy**
```bash
git push heroku main
```

6. **Run Migrations**
```bash
heroku run npx prisma migrate deploy
heroku run npx prisma db seed
```

### Option 2: Deploy to DigitalOcean App Platform

1. **Create PostgreSQL Database**
   - Go to DigitalOcean Dashboard
   - Create a Managed PostgreSQL Database
   - Note the connection string

2. **Create App**
   - Connect your GitHub repository
   - Select the `backend` folder as the source
   - Choose Node.js as the environment

3. **Configure Environment Variables**
   - Add all environment variables from `.env.example`
   - Use the DATABASE_URL from your PostgreSQL database

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment to complete

### Option 3: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.medium or larger
   - Configure security groups (ports 22, 80, 443, 3001)

2. **Connect and Install Dependencies**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

3. **Setup Database**
```bash
sudo -u postgres psql
CREATE DATABASE emergency_db;
CREATE USER emergency_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE emergency_db TO emergency_user;
\q
```

4. **Clone and Setup Application**
```bash
git clone https://github.com/splitleasesharath/_internal-emergency.git
cd _internal-emergency/backend
npm install
```

5. **Configure Environment**
```bash
cp .env.example .env
nano .env
# Edit with your production values
```

6. **Build and Run**
```bash
npm run build
npx prisma migrate deploy
npx prisma db seed
pm2 start dist/index.js --name emergency-api
pm2 save
pm2 startup
```

7. **Setup Nginx as Reverse Proxy**
```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/emergency-api

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/emergency-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel login
vercel
```

3. **Configure Environment Variables**
   - In Vercel Dashboard, go to Project Settings → Environment Variables
   - Add `REACT_APP_API_URL` pointing to your backend URL

4. **Redeploy**
```bash
vercel --prod
```

### Option 2: Deploy to Netlify

1. **Build the App**
```bash
cd frontend
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

3. **Configure Environment Variables**
   - In Netlify Dashboard, go to Site Settings → Environment
   - Add `REACT_APP_API_URL`

### Option 3: Deploy to CloudFlare Pages

1. **Connect GitHub Repository**
   - Go to CloudFlare Pages Dashboard
   - Connect your GitHub account
   - Select the repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `frontend`

3. **Set Environment Variables**
   - Add `REACT_APP_API_URL` in the environment variables section

4. **Deploy**
   - Click "Save and Deploy"

## Database Migrations

### Running Migrations in Production

```bash
# For Heroku
heroku run npx prisma migrate deploy

# For other platforms
npx prisma migrate deploy
```

### Creating New Migrations

```bash
# Development
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

## Monitoring and Logs

### Backend Logs

**Heroku:**
```bash
heroku logs --tail
```

**PM2 (EC2):**
```bash
pm2 logs emergency-api
pm2 monit
```

**DigitalOcean:**
- View logs in the App Platform dashboard

### Database Monitoring

**Prisma Studio:**
```bash
npx prisma studio
```

### Health Checks

- Backend health check: `GET /health`
- Returns: `{ "status": "ok", "timestamp": "..." }`

## Backup and Recovery

### Database Backup

**Heroku:**
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**PostgreSQL Manual Backup:**
```bash
pg_dump -U emergency_user -d emergency_db > backup.sql
```

**Restore:**
```bash
psql -U emergency_user -d emergency_db < backup.sql
```

## Security Best Practices

1. **Use HTTPS Only**
   - Ensure SSL/TLS certificates are installed
   - Force HTTPS redirects

2. **Environment Variables**
   - Never commit `.env` files
   - Use secure secret management (AWS Secrets Manager, etc.)

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict access by IP

4. **API Security**
   - Implement rate limiting
   - Use JWT with short expiration times
   - Validate all inputs

5. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check DATABASE_URL format
- Verify database is running
- Check firewall rules

**CORS Errors:**
- Verify CORS_ORIGIN is set correctly
- Check frontend API URL

**Email/SMS Not Sending:**
- Verify Twilio/SMTP credentials
- Check account limits
- Review error logs

**Slack Notifications Not Working:**
- Verify webhook URL
- Check Slack bot permissions
- Test webhook manually

## Performance Optimization

1. **Enable Compression**
   - Already configured in Express

2. **Use CDN for Frontend**
   - CloudFlare, AWS CloudFront, or similar

3. **Database Indexing**
   - Already configured in Prisma schema

4. **Caching**
   - Consider Redis for API responses
   - Cache team members list

5. **Load Balancing**
   - Use multiple backend instances
   - Configure health checks

## Scaling

### Horizontal Scaling

- Deploy multiple backend instances
- Use load balancer (AWS ELB, Heroku dyno scaling)
- Shared PostgreSQL database

### Database Scaling

- Use read replicas for heavy read operations
- Consider connection pooling (PgBouncer)
- Upgrade database tier as needed

## Cost Optimization

### Heroku Costs
- Dyno: $25-50/month
- PostgreSQL: $50-200/month
- Total: ~$100-300/month

### DigitalOcean Costs
- App Platform: $12-24/month
- Database: $15-60/month
- Total: ~$30-100/month

### AWS Costs
- EC2: $20-100/month
- RDS: $50-200/month
- Total: ~$100-400/month

## Support and Maintenance

- Monitor error rates daily
- Review logs weekly
- Update dependencies monthly
- Perform database backups daily
- Test disaster recovery quarterly
