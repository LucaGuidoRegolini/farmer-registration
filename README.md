# Projeto Farmer registration

O objetivo do projeto é conseguir armazenar os dados de fazendeiros e suas fazendas em uma API REST, e entregar esses dados analisados para uma dashboard.

O desafio foi feito seguindo os requisitos do teste *Brain Agriculture*

[Desafio Brain Agriculture](https://github.com/brain-ag/trabalhe-conosco)

## Tenologias usadas

- **Typescript** - uma linguagem de programação de código aberto desenvolvida pela Microsoft usada pra criar a API

- **Jest**  - um framework de teste automatizados em JavaScript usado para garantir a qualidade do código

- **Stryker** - um framework de teste de mutação usado para garantir a qualidade dos testes

- **Docker** - um software de código aberto usado para implantar aplicativos dentro de containers

- **CircleCi** - uma plataforma de entrega contínua e integração contínua, usada para integrar o código com a infraestrutura

- **Terraform** -  uma ferramenta de software de infraestrutura como código usada para criar a infra do projeto

- **Ansible** -  uma ferramenta de código aberto para gerenciar, automatizar e configurar servidores

- **AWS** -  uma cloud com inúmeras ferramentas de infraestrutura, no projeto foram usadas algumas delas

## Desing patternes e padrões de projeto

O projeto foi feito com alguns padrões de excelência estabelecidos pela comunidade, alguns deles sendo:

- **Clean Architecture** - um padrão de arquitetura de software que tem como objetivo separar as preocupações do software, dividindo o em camadas.

- **TDD** - Desenvolvimento Orientado por Testes, trata-se de uma prática de desenvolvimento onde a codificação começa a partir da escrita de testes unitários.

- **Dependency injection** - um padrão de desenvolvimento usado quando é necessário manter baixo o nível de acoplamento entre diferentes módulos.

- **Factory Method** - um padrão de projeto de software que permite às classes delegar para subclasses decidirem como sera feito a construção de objetos.

- **Singleton** - um padrão de projeto de software. Este padrão garante a existência de apenas uma instância de uma classe.

- **Builder** - um padrão de projeto de software criacional que permite a separação da construção de um objeto complexo.

## Como usar a API

### 1 - Usar localmente
É possível instanciar a API localmente para testar, pra isso sera necessário ter o docker e docker-compose instalados na maquina, e também sera necessário o node e npm

1. **Verificar a instalação do docker e docker-compose**

para verificar o docker use o comando
```cmd
docker -v
```
o resultado esperado sera parecido com isso.

![](/imagens/docker-verify.PNG)

ja para verificar o docker-compose use o comando

```cmd
docker compose version
```
o resultado esperado sera parecido com isso.

![](/imagens/docker-compose-verify.PNG)

2. **Verificar o node e npm**

para o node use o comando
```cmd
node -v
```
o resultado esperado sera parecido com isso.

![](/imagens/node-verify.PNG)

e para o npm use o comando
```cmd
npm -v
```
o resultado esperado sera parecido com isso.

![](/imagens/npm-verify.PNG)

3. **Baixar o repositório**

Se tudo estiver corrido bem a maquina ja esta pronta para baixar o repositório
no site [https://github.com/LucaGuidoRegolini/farmer-registration](https://github.com/LucaGuidoRegolini/farmer-registration) clique no botão **<>code** e depois no **Download ZIP**

![](/imagens/dowload-project.PNG)

ao descompactar o projeto abra o terminal na pasta rais e usando o comando **CD** va até a pasta **/app**
![](/imagens/enter_in_app.PNG)

4. **Iniciar os containers**

Agora basta iniciar os containers usando o docker-compose
```cmd
docker compose up -d
```
![](/imagens/run-docker-compose.PNG)

para verificar se esta tudo certo uso o comando para ver os logs do container
```cmd
docker logs project
```
![](/imagens/verify-server.PNG)

> É importante lembrar que o docker compose vai instanciar um container postgres e o container com o projeto por isso a porta 5432 (default do postgres) e a 3000 precisam estar livres.

Com tudo pronto basta usar a API, para a documentação das rotas veja o [postman do projeto](https://www.postman.com/lively-capsule-721142/workspace/farmer-register/overview)

### 2 - Usar online

O projeto ja esta funcionando no ip [52.45.30.246:3344](h52.45.30.246:3344)
para usar pasta entrar no [postman do projeto](https://www.postman.com/lively-capsule-721142/workspace/farmer-register/overview)

## Configuração do postman

O postman tem 2 ambientes, um para acessar online e outro localmente, caso queira usar localmente escolha **Local**, mas caso queira acessar online use **Develop**

![](/imagens/postman-config.PNG)

> O postman web não suportar usar o localhost, por isso para que o **Local** funcione sera necessário usar o Postman desktop

## Registrando a primeira fazenda

Ja esta tudo pronto e configurado, tudo que resta é usar a API, para ajudar nisso aqui esta os primeiros passos necessários para registrar sua primeira fazenda

### 1 - Criar um usuário

Na API os dados são separados por usuário, de modo que um usuário não pode ver as fazendas de outro, Por isso é necessário criar um usuário só pra você.

na rota **Create user** dentro da pasta **User** você poderá fazer isso.

![](/imagens/1_step_create_user.PNG)

### 2 - Login na plataforma

Uma vez criado vai ser necessário fazer o login com esse usuário, essa rota ira gerar um **_JSON Web Token_**, um toque que sera usado para autenticar seu usuário nas próximas rotas, o postman vai lidar com esse token pra você automaticamente, mas se para criar uma aplicação web usando a API sera necessário uma atenção especial nesse ponto.

na rota **Login user** dentro da pasta **User** você poderá fazer isso.

![](/imagens/2_step_login_user.PNG)

### 3 - Criar a fazenda

Uma vez logado, esta tudo pronto para criar a primeira fazenda, sera necessário o nome nome do fazendeiro e seu documento (CPF/CNPJ), além dos dados da fazenda, sendo o nome, estado, cidade, as áreas e as culturas plantadas.

na rota **Create farm** dentro da pasta **Farm** você poderá fazer isso.

![](/imagens/3_step_create_farm.PNG)

### 4 -Listar fazendeiros

A fazenda foi criada, conseguimos. Mas só por garantia que tal buscar os dados da fazenda? Vamos começar listando os fazendeiros, essa rota trás uma lista paginada de todos os fazendeiros, nesse caso temos apenas 1.

na rota **List farmer** dentro da pasta **Farm** você poderá fazer isso.

![](/imagens/4_step_lsit_farmer.PNG)

### 5 -Buscar fazenda

Agora com o **id** que veio na resposta da rota anteiros podemos buscar o fazendeiro e sua fazenda, pasta colocar esse **id** no **Params** na **farm_id** como mostra a imagem, e vamos conseguir todos os dados. 

na rota **Get farm** dentro da pasta **Farm** você poderá fazer isso.

![](/imagens/5_step_get_farm.PNG)

### Bonus

Conseguimos confirmar que os dados estão salvos, mas como etapa bonus vamos ver um apanhado geral de todas as nossas fazendas, essa rota trás dados para ter uma visão geral de **TODAS** as fazendas, como só temos uma não ser tão interessante, mas ainda vale a menção honrosa.

na rota **Get farms data** dentro da pasta **Farm** você poderá fazer isso.

![](/imagens/5_step_get_farms_data.PNG)

## Conclusão

O projeto foi muito interessante de ser desenvolvido, apesar de simples foi um grande desafio estruturar a infraestrutura dele na aws através do Terraform e Ansible, com certeza foi um momento de muito aprendizado. Espero que você tenha gostado de ver o meu projeto tanto quanto eu gostei de produzir ele.
O mundo da tecnologia é vasto em apaixonante, existiam infinitas maneiras para completar esse desafio, mesmo usando as mesmas tecnologias, se gostou da ideia fique a vontade para tentar de outra forma, pode usar o código da forma que quiser.
