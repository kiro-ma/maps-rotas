# Bem vindo ao Gerenciador de Rotas!

Esta aplicação utiliza a **Routes API** do Google. Consiste em um mapa, e campos para criar rotas com um número variável de **waypoints** (Pontos de parada na rota). Também é possível nomear e salvar rotas em uma tabela, a tabela mantém seus dados salvos no localstorage, então é possível fechar o site, retornar mais tarde e seu trabalho estará salvo.
As rotas da tabela podem ser salvas localmente como um arquivo .txt, o mesmo pode ser importado depois e seus dados serão carregados na tabela.
Além disso, sempre que uma rota for mostrada, os passos da rota serão detalhados na tela.
Rotas podem ser calculadas para viagem de carro, andando, de bicicleta, e caminhando + transporte público. 

# Guias
A seguir há descrições de como usar cada uma das funcionalidades presentes na aplicação.

## Criar uma rota com waypoints

A página é contida de duas "linhas", em que a primeira contém o mapa, e a segunda o form de criar rota, a table com rotas salvar, e um card que irá descrever todos os passos de uma rota ao selecioná-la.
**Para criar uma rota** basta preencher os campos **"início"** e **"fim"** e então clicar em **"criar rota"**, a rota será demonstrada no mapa, se for possível. **Para criar uma rota com waypoints** clique no botão **"adicionar parada"**, os campos para digitar os pontos de parada irão aparecer, preencha-os. Não se preocupe em deixar campos de parada vazios, estes serão ignorados pela aplicação.

## Nomear e salvar rota na tabela

Ao criar uma rota, será automáticamente gerado um nome no campo **"salvar"**, caso queira mudar o nome, escreva o que deseja, depois clique no botão. Rotas salvas serão adicionadas à tabela.

## Exportar as rotas da tabela

As rotas da tabela são salvar no **localstorage** do navegador, este poderá ser reescrito caso a tabela seja modificada, se desejar salvar o estado da tabela, clique em **"baixar rotas"**, será baixado um arquivo .txt que descreve um objeto com todas as linhas da tabela, este mesmo arquivo .txt pode ser importado para restaurar a tabela para o estado salvo nele.

## Importar .txt com rotas para a tabela
**AVISO: Ao fazer isso, os dados atuais da tabela serão substituídos pelos dados importados.**
Para importar rotas clique em **"escolher arquivo"**, então selecione um arquivo .txt compatível (descrito no tópico acima).

## Editar uma rota já salva
**Obs: Esta é a forma com que se pode remover waypoints de uma rota.**
Selecione na tabela a rota a qual deseja editar, ela será demonstrada no mapa e seus dados serão preenchidos no form de criar rotas. Edite a rota como quiser e salve-a novamente, **lembrando que ela será salva como uma nova rota na tabela**, então se desejar, delete a rota antiga.

## Escolher a forma de viajar (Transporte)
Com uma rota selecionada, altere o campo **"Modo de viagem"**, a rota irá mudar para mostrar o que se pede.
**Lembrando que algumas partes da Routes API ainda estão na versão BETA, e dentre outros detalhes, os dados de transporte público dentro de cidades brasileiras nem sempre funciona.**

## Criado por Kiro Marcell, disponível no [GitHub](https://github.com/kiro-ma).