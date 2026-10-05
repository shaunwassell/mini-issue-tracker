# Mini Issue Tracker (GHAS Demo App)

A deliberately vulnerable Node.js application for GitHub security
training.

> WARNING: This application contains intentional security
> vulnerabilities. Do not deploy it to a production or
> internet-accessible environment.

## Run

Install dependencies:

    npm install

Start the application:

    npm start

Open:

    http://localhost:3000

## Demo vulnerabilities

The application intentionally contains examples suitable for
demonstrating:

- Code scanning with CodeQL
- SQL injection
- Command injection
- Path traversal
- Cross-site scripting (XSS)
- Secret scanning
- Dependency scanning
- Dependabot
- GitHub Actions security

## Intended use

This repository exists only for security training and demonstrations.

The vulnerabilities should be fixed as part of the exercises.