<p align="center">
  <img src="/etc/public/banner.png" alt="Project logo">
</p>
<h3 align="center">Lanten</h3>

---

<p align="center">Communication web application for landlords and tenants.
    <br> 
</p>

## 📝 Table of Contents

- [🧐 About](#about)
- [🏁 Getting Started ](#getting_started)
  - [Prerequisites](#prerequisites)
  - [Docker Setup](#docker-setup)
- [🎈 Usage ](#usage)
- [⛏️ Built Using ](#️built_using)

## 🧐 About<a name = "about"></a>

Tailored for landlords and tenants, Lanten offers streamlined lease management, maintenance requests, payment reminders, and communication tools. Experience simplicity and efficiency for all your property needs!

Here is a screenshot of the properties page:
<p align="center">
  <img src="/etc/public/page-properties.png" alt="Project logo">
</p>


Here is a screenshot of the lease dashboard:
<p align="center">
  <img src="/etc/public/page-lease-dash.png" alt="Project logo">
</p>

There are many more features!


## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development
and testing purposes.

### Prerequisites

Set up these services:
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- [Azure Storage Queue](https://azure.microsoft.com/en-us/services/storage/queues/)
- [Twilio SendGrid](https://sendgrid.com/)


### Docker Setup

These steps will guide you through running the website locally using Docker.

1. Ensure you have Docker and Docker Compose installed on your machine. If not, you can download them from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. Clone the repository to your local machine.
3. In the root directory of the project, you'll find two example environment files: `.env.azure.example` and `.env.server.example`.
4. Create two new files named `.env.azure` and `.env.server` respectively in the root directory, and copy the contents of the example files into them. Replace the placeholder values with your actual values.

You can now build the Docker images and start the containers using Docker Compose:
```bash
docker compose -f docker-compose.dev.yml up
```
You can access the site at http://localhost:3000.




## 🎈 Usage <a name="usage"></a>
Here's how to use the application:

1. **Sign up as a landlord**: Register an account and choose the landlord role.

2. **Add a property**: After signing up, you can add a property. Fill in the necessary details about your property.

3. **Create a lease for the property**: Once your property has been added, you can create a lease for it.

4. **Invite tenants**: After creating the lease, you can invite tenants to the lease.

By following these steps, you will gain access to a plethora of lease-related features, including:
- Lease Information
- Announcements
- Payments
- Reminders
- Maintenance Requests
- Documents
- Messaging

Enjoy managing your properties with ease and efficiency!

## ⛏️ Built Using <a name = "built_using"></a>

-   [Next.js](https://nextjs.org/) - Frontend Framework
-   [Express](https://expressjs.com/) - Backend Framework
-   [Postgres](https://www.postgresql.org/) - Relational Database
-   [Redis](https://redis.io/) - In-memory Database
-   [Azure](https://azure.microsoft.com/) - Cloud Services (Functions, Queue, Blob Storage)