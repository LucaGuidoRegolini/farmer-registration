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
