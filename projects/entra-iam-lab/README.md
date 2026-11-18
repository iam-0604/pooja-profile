# Microsoft Entra ID IAM Hands-on Lab

This project documents a practical Microsoft Entra ID lab covering identity lifecycle management, access control, enterprise application assignment, OpenID Connect (OIDC) SSO, MFA registration, and audit validation.

> This is a personal hands-on lab environment, not production enterprise experience.

## Lab objectives

- Practice Joiner-Mover-Leaver (JML) operations in Microsoft Entra ID
- Create and manage security groups
- Detect and remediate residual access after a mover event
- Simulate incorrect access assignment and correct it
- Assign and remove users from an Enterprise Application
- Register a local web application in Entra ID
- Implement OIDC sign-in using MSAL for Node.js
- Register Microsoft Authenticator for a test user using Security Defaults
- Review Entra audit and sign-in logs

## Scenarios completed

### 1. Joiner and group-based access

Created test identities and security groups representing business access, including Finance, HR, and IT access.

### 2. Mover and residual access

Simulated a Finance-to-HR transfer. The old Finance access was deliberately left in place to create residual access, then identified and removed after review.

Key learning:
- A mover event requires reassessment of old access, not only addition of new access.
- Residual access is a least-privilege and audit risk.
- Remediation should be validated in Entra audit logs.

### 3. Incorrect group assignment

Simulated a user receiving inappropriate HR access, investigated the direct group assignment, removed it, and assigned the correct IT group.

### 4. Leaver

Practiced a leaver flow by disabling a test account, revoking sessions, removing group access, and reviewing audit evidence.

### 5. Enterprise Application assignment

Created a non-gallery test Enterprise Application and practiced direct user assignment and removal.

Key distinction:
- **Application assignment** determines whether a user is entitled to access an application through Entra.
- **Provisioning** creates, updates, or disables the user account in the target application and requires a provisioning integration such as SCIM.

### 6. OIDC SSO

Created an Entra App Registration named `FutureBank SSO Demo` and integrated a local Node.js/Express web application with Microsoft Entra ID using MSAL and the OpenID Connect authorization-code flow.

Successful authentication path:

```text
Browser
  -> FutureBank SSO Demo
  -> Microsoft Entra ID
  -> Authorization code
  -> Token exchange
  -> Local authenticated session
```

The lab was tested with a dedicated Entra test identity.

### 7. MFA registration

With Security Defaults enabled, registered Microsoft Authenticator for a test Entra identity and verified the method under the user's Authentication methods.

This project does **not** claim that a Conditional Access policy was configured to force MFA specifically for the FutureBank application.

### 8. Audit evidence

Reviewed Entra audit/sign-in records to validate identity and access-management activity and investigate interrupted authentication events.

## Technologies

- Microsoft Entra ID
- Microsoft Entra admin center
- Microsoft Authenticator
- Node.js
- Express
- MSAL Node (`@azure/msal-node`)
- OpenID Connect / OAuth 2.0 authorization-code flow
- Git / GitHub

## Run the local SSO demo

### Prerequisites

- Node.js
- A Microsoft Entra tenant
- An Entra App Registration
- A Web redirect URI configured as:

```text
http://localhost:3000/auth/redirect
```

### Install

```bash
npm install
cp .env.example .env
```

Populate `.env` with values from your own Entra App Registration.

Never commit `.env` or a client secret.

Run:

```bash
node app.js
```

Then browse to:

```text
http://localhost:3000
```

## Security notes

- No real passwords, tokens, client secrets, tenant IDs, or personal identifiers are stored in this repository.
- `.env` is excluded from Git.
- Client secrets are suitable only for this local learning exercise; production applications should use stronger credential patterns appropriate to the environment.

## Interview summary

> Built a Microsoft Entra ID hands-on lab covering JML, security-group access, residual-access remediation, enterprise-application assignment, OIDC SSO with MSAL, Microsoft Authenticator registration, and audit/sign-in validation. The work was performed in a personal test tenant and is presented as lab/project experience rather than production Entra administration.
