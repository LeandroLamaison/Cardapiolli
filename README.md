<img align="left" width="100" height="100" src="/readme-assets/Logo.svg">

# Cardapiolli

## Um cardápio de cardápios

Aplicação web criada utilizando TypeScript, NodeJS e ReactJS. A idéia da aplicação é uma plataforma onde empresas podem registrar
seus cardápios, criando uma biblioteca de cardápios aos quais os clientes podem acessar, e filtrar os restaurantes por nome, cidade 
ou pratos que possuem.

# Telas  

### Home
<img align="center" width="700" height="800" src="/readme-assets/Home.png">  

### Informações do cardápio
<img align="center" width="700" height="800" src="/readme-assets/Detail.png">  

### Login
<img align="center" width="700" height="600" src="/readme-assets/Login.png">  

### Cadastro
<img align="center" width="700" height="1000" src="/readme-assets/Register.png">  

### Profile
<img align="center" width="700" height="800" src="/readme-assets/Profile.png">  

### Adicionar prato
<img align="center" width="700" height="800" src="/readme-assets/NewPlate.png">  
  
## Como rodar no seu computador  

* Pré-requisitos
  * Ter o Node.js instalado no computador
  * Possuir um gerenciador de pacotes, como o npm ou o yarn

1. Clone o repositório em sua máquina:  
  `git clone https://github.com/LeandroLamaison/Cardapiolli`  
    
2. Configurando o backend  
  Entre na pasta server: `cd server`  
  Instale as dependências: `npm install`  
  Crie o banco de dados: `npm run knex:migrate`  
  Inicie o servidor: `npm start`  
  
3. Configurando o frontend  
  Entre na pasta website: `cd website`  
  Instale as dependências: `npm install`  
  Inicie a aplicação: `npm start`

