# Project

Docker steps:
1. `.env.azure.example` to `.env.azure`
2. `.env.server.example` to `env.server`
3. `client\.env.development.sample`
4. `docker-compose up`

Manual steps:
Firstly, run **Postgres** and **Redis**.
```
cd azure
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
func start
```
```
azurite-blob -l path/to/azurite/workspace
```
```
cd server
npm install
npm run dev
```
```
cd client
npm intall
npm run dev
```
http://localhost:3000/