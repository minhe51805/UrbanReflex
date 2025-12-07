# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The UrbanReflex team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **[security@urbanreflex.org]** (or create a contact email)

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include in Your Report

Please include the following information in your security report:

- **Type of vulnerability** (e.g., SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s)** related to the manifestation of the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the vulnerability
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability**, including how an attacker might exploit it

This information will help us triage your report more quickly.

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not access a system or account beyond what is necessary to demonstrate the vulnerability
- Do not intentionally harm our users or degrade user experience
- Do not access, modify, or delete user data
- Do not publicly disclose the vulnerability until we've had a chance to fix it

## Security Measures

### Current Security Implementations

**Authentication & Authorization:**

- JWT-based authentication for API access
- Role-based access control (Admin/User)
- API key management system
- Password hashing with bcrypt

**API Security:**

- CORS configuration for cross-origin requests
- Input validation on all endpoints
- Rate limiting (planned)
- SQL injection prevention through parameterized queries

**Data Protection:**

- Environment variable protection (.env files)
- Secure handling of API keys
- No sensitive data in logs
- MongoDB connection with authentication

**Infrastructure:**

- Docker containerization
- Secure MongoDB setup
- Environment isolation

### Planned Security Enhancements

- [ ] Rate limiting implementation
- [ ] API request logging and monitoring
- [ ] Enhanced input sanitization
- [ ] Security headers implementation
- [ ] Automated dependency vulnerability scanning
- [ ] Security audit logging

## Security Best Practices for Contributors

### Environment Variables

- Never commit `.env` files or API keys
- Use `.env.example` for template files only
- Rotate API keys regularly

### Code Security

- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper error handling without exposing system information
- Follow principle of least privilege

### Dependencies

- Keep dependencies up to date
- Review security advisories for used packages
- Use tools like `pip-audit` for Python and `npm audit` for Node.js

### API Development

- Implement proper authentication for sensitive endpoints
- Use HTTPS in production
- Validate content types and request sizes
- Implement proper logging without exposing sensitive data

## Incident Response

### In Case of a Security Incident

1. **Immediate Assessment**

   - Assess the scope and impact of the incident
   - Document the incident with timestamps and details
   - Determine if user data was compromised

2. **Containment**

   - Stop the attack vector if still active
   - Preserve evidence for investigation
   - Implement temporary mitigations

3. **Communication**

   - Notify affected users if personal data was compromised
   - Provide clear information about what happened and what we're doing
   - Update status on GitHub and relevant channels

4. **Recovery**

   - Fix the vulnerability
   - Deploy security patches
   - Monitor for additional attacks

5. **Lessons Learned**
   - Conduct post-incident review
   - Update security procedures
   - Implement additional monitoring if needed

## Security-Related Configuration

### Production Deployment Checklist

- [ ] All default passwords changed
- [ ] Environment variables properly configured
- [ ] HTTPS enabled with valid certificates
- [ ] Database connections encrypted
- [ ] Unnecessary ports closed
- [ ] Security headers configured
- [ ] Error pages don't expose system information
- [ ] Logging configured without sensitive data
- [ ] Backup and recovery procedures tested

### Development Security

- [ ] Use separate development and production databases
- [ ] Never use production API keys in development
- [ ] Regularly update development dependencies
- [ ] Use secure coding practices
- [ ] Review code for security issues before merging

## Third-Party Security

### External APIs

- **OpenAQ API**: Public air quality data (no sensitive information)
- **OpenWeatherMap**: Weather data with API key authentication
- **Google Gemini**: AI services with API key authentication
- **Pinecone**: Vector database with API key authentication

### Security Monitoring

We monitor security advisories for all third-party dependencies and will update this document when security-relevant changes are made.

## Contact Information

For security-related questions that are not vulnerabilities, please contact:

- **General Security Questions**: [security@urbanreflex.org]
- **Vulnerability Reports**: [security@urbanreflex.org]

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security vulnerabilities:

<!-- Add names of security researchers who have helped -->

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE/SANS Top 25](https://www.sans.org/top25-software-errors/)

---

Last updated: December 4, 2025
