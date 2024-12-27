<h1 align="center" style="font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 16px">Desafio técnico | Tokenlab</h1>
<p align="center"> 
	<img src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node Badge" /> 
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript Badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" alt="Express Badge" />  
	<img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" alt="PostgreSQL Badge" /> 
	<img src="https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=Jest&logoColor=white" alt="Jest Badge" /> 
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white" alt="Docker Badge" /> 
	<img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git Badge" /> 
	<img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" /> 
	<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman Badge" /> 
</p>
<div align="center" style="margin: 16px 0;">
	<a href="#getting-started">Getting Started</a> • 
	<a href="#api-endpoints">API Endpoints</a> • 
	<a href="#collaborators">Collaborators</a>
</div>
<h2 id="getting-started">🚀 Getting started</h2>
Web event calendar system
<h3>💻 Technologies used</h3>
<ul>
	<li>Node.js</li>
	<li>JavaScript</li>
  <li>TypeScript</li>
  <li>Express</li>
	<li>PostgreSQL</li>
	<li>Jest</li>
	<li>Docker</li>
	<li>Git</li>
	<li>GitHub</li>
	<li>VSCode</li>
	<li>Postman</li>
</ul>
<h3>🖨️ Cloning a project</h3>
To clone the project, use the following command

```bash
git clone https://github.com/GMarques30/desafio-tecnico-tokenlab
```

<h3> ⚙ Environment variables</h3>
Use the `.env.example` as reference to create your configuration file `.env` with your environment variables

```yaml
DATABASE_URL=
SECRET_KEY=
PORT=
```

<h3>🏁 Starting</h3>
To start the project, use the following command

```bash
cd backend
docker-compose up --build -d
```

<h2 id="api-endpoints">📌 API Endpoints</h2>
All API `endpoints`, `requests` and `responses` are listed here

| Route                                | Description                                                |
| ------------------------------------ | ---------------------------------------------------------- |
| `POST /signup`                       | Create an account.                                         |
| `POST /login`                        | Authenticate.                                              |
| `POST /events/:eventId`              | Create an event.                                           |
| `PUT /events/:eventId`               | Update an event.                                           |
| `DELETE /events/:eventId`            | Delete an event.                                           |
| `GET /events`                        | Get all events from the authenticated account              |
| `POST /events/:eventId/invite`       | Invite an account to the event                             |
| `PATCH /invitees/:inviteeId/accept`  | Accept the invitation to the event                         |
| `PATCH /invitees/:inviteeId/decline` | Decline the invitation to the event                        |
| `GET /invitees`                      | Get all pending invitations from the authenticated account |

<h2 id="collaborators">🤝 Collaborators</h2>
Here are all the people who contributed to the project.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GMarques30">
        <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/101661947?v=4" width="100px;" alt="Giovanni Marques Profile Picture"/><br>
        <sub>
          <b>Giovanni Marques</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

---

<h4 align="center">Made by Giovanni Marques 👋 <a href="https://www.linkedin.com/in/gmarques30/">See my LinkedIn</a></h4>
