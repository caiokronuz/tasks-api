#Como instalar?
`$ git clone https://github.com/caiokronuz/tasks-api.git`
`$ cd tasks-api`
`$ npm install`

Agora que temos as dependências instaladas, vamos criar o banco de dados. Para isso, basta rodar o comando: 

`$ npm run knex:migrate `

- Esse comando irá fazer as migrações presentes em: src/database/migrations

Agora basta você iniciar a api rodando o comando: 

`$ npm run start`

Ou:

`$ npm run dev`

Caso deseje fazer alguma modificação e queira que as atualizações entrem sozinhas.

#Rotas

# Rotas de autenticação
-  /register

      Rota de registro, espera receber: name, email, password.
	  
	Ex: 
			{
				"name": "Fulano da Silva",
				"email": "fulanodasilva@teste.com",
				"password": "12345678"
			}
- /login
     Rota de login, espera receber: email, password.
	 
  Ex:
			{
				"email":"fulanodasilva@teste.com",
				"password": "12345678",
			}

- /update_password
     Rota para o usuário cadastrado poder mudar sua senha, espera receber: Token de autorização JWT, password, newPassword.

     Ex:
			{
				"password": "12345678",
				"newPassword": "fulano123"
			}

# Rotas das tasks
Todas essas rotas, por serem privadas obrigatóriamente devem receber o token JWT, que deve estar no cabeçalho da requisição no formato de Bearer Token.

- /tasks (POST)
 Rota para o cadastro de tasks, espera receber apenas o titulo da task.
 
 Ex:
 		{
 			"title": "Estudar javascript"
 		}
   
- /tasks (GET)
  Rota que retorna as tasks cadastradas pelo usuário (Cada usuário só pode ver suas próprias tasks).
  
  	{
  		id: 1,
		title: "Estudar javascript",
		done: 0,
		user_id: 1,
		name: "Fulano da Silva"
 	 }

- /tasks/:id (GET)
  Retorna uma task especifica. 
  	{
  		id: 1,
		title: "Estudar javascript",
		done: 0,
		user_id: 1,
		name: "Fulano da Silva"
 	 }

- /tasks/:id (PUT)
  Rota para que o usuário pode alterar o estado da sua task, se ele foi feita ou não. Espera receber apenas o "done" já que o id da task já está sendo passado nos parametros da URL. Assim como ver, o usuário só pode alterar suas proprias tasks.
  
  o done só pode ser 0 (false) ou 1 (true).
  
  Ex:
  	{
  		"done": 1
 	 }

- /tasks/:id (DELETE)
 Deleta a task, não recebe nada mais do que o id passado no parametro da URL.
