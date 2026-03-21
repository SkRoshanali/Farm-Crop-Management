# Security Documentation

## Overview
This document outlines the security measures implemented in the Farm Crop Management System and best practices for deployment.

## Security Features Implemented

### 1. Authentication & Authorization
- **JWT-based authentication** with stateless sessions
- **Role-based access control (RBAC)** with ADMIN and USER roles
- **BCrypt password hashing** with strength factor of 12
- **Password complexity requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character (@$!%*?&)

### 2. Security Headers
- **Content Security Policy (CSP)**: `default-src 'self'`
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-XSS-Protection**: Enabled with mode=block
- **CORS Configuration**: Restricted to specific origins

### 3. Input Validation
- All DTOs use Jakarta Bean Validation
- Custom validators for business logic (e.g., date range validation)
- Request size limits to prevent DoS attacks
- JWT token length validation (max 1024 characters)

### 4. Data Protection
- **No hardcoded credentials** - all sensitive data uses environment variables
- **SQL injection prevention** - using JPA with parameterized queries
- **Error message sanitization** - no stack traces exposed in production

### 5. Database Security
- Connection pooling with HikariCP
- Prepared statements via JPA
- No SQL logging in production

## Environment Variables

### Required Environment Variables

```bash
# Database
DB_URL=jdbc:mysql://localhost:3306/farm_crop_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_secure_db_password

# JWT
JWT_SECRET=your_256_bit_secret_key_here
JWT_EXPIRATION=86400000

# Profile
SPRING_PROFILES_ACTIVE=prod
```

### Generating Secure JWT Secret

```bash
# Generate a secure 256-bit secret
openssl rand -base64 32
```

## Deployment Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Generate new JWT secret using `openssl rand -base64 32`
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Configure HTTPS/TLS certificates
- [ ] Update CORS allowed origins to production URLs
- [ ] Enable database SSL connections
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting (consider using API Gateway)
- [ ] Set up monitoring and alerting
- [ ] Review and update security headers
- [ ] Perform security audit/penetration testing

### Production Configuration

1. **Database Connection**
   ```properties
   spring.datasource.url=${DB_URL}?useSSL=true&requireSSL=true
   ```

2. **HTTPS Configuration** (add to application-prod.properties)
   ```properties
   server.ssl.enabled=true
   server.ssl.key-store=classpath:keystore.p12
   server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
   server.ssl.key-store-type=PKCS12
   server.ssl.key-alias=tomcat
   ```

3. **Update CORS Origins** in SecurityConfig.java
   ```java
   configuration.setAllowedOrigins(List.of("https://yourdomain.com"));
   ```

## Known Security Considerations

### Current Limitations
1. **No refresh token mechanism** - Users must re-authenticate after token expiry
2. **No token blacklist** - Logout doesn't invalidate tokens server-side
3. **No rate limiting** - Consider implementing API Gateway with rate limits
4. **No 2FA support** - Consider adding for admin accounts
5. **No email verification** - Users can register without email confirmation

### Recommended Enhancements
1. Implement refresh token rotation
2. Add Redis-based token blacklist for logout
3. Implement rate limiting using Spring Cloud Gateway or Bucket4j
4. Add audit logging for sensitive operations
5. Implement account lockout after failed login attempts
6. Add CAPTCHA for registration/login
7. Implement password reset functionality
8. Add email verification for new registrations

## Security Incident Response

### If Credentials Are Compromised
1. Immediately rotate all secrets (JWT secret, database passwords)
2. Invalidate all active sessions
3. Force password reset for all users
4. Review audit logs for suspicious activity
5. Notify affected users

### Reporting Security Issues
Please report security vulnerabilities to: security@yourcompany.com

## Compliance

### Data Protection
- Passwords are hashed and never stored in plain text
- Sensitive data is not logged
- Error messages don't expose system internals

### OWASP Top 10 Coverage
- ✅ A01:2021 - Broken Access Control: Role-based access control implemented
- ✅ A02:2021 - Cryptographic Failures: BCrypt for passwords, secure JWT
- ✅ A03:2021 - Injection: Parameterized queries via JPA
- ✅ A04:2021 - Insecure Design: Security by design principles followed
- ✅ A05:2021 - Security Misconfiguration: Secure defaults, no debug in prod
- ⚠️ A06:2021 - Vulnerable Components: Keep dependencies updated
- ✅ A07:2021 - Authentication Failures: Strong password policy, JWT auth
- ⚠️ A08:2021 - Software and Data Integrity: Consider signing artifacts
- ✅ A09:2021 - Security Logging: Logging implemented (enhance for audit)
- ⚠️ A10:2021 - Server-Side Request Forgery: Not applicable (no external requests)

## Regular Maintenance

### Monthly Tasks
- Review and update dependencies
- Check for security advisories
- Review access logs for anomalies
- Test backup restoration

### Quarterly Tasks
- Rotate JWT secrets
- Review and update security policies
- Conduct security training
- Perform vulnerability scanning

## References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
