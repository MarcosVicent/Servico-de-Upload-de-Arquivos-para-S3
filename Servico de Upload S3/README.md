Serviço de Upload de Arquivos para S3
Este projeto implementa um serviço serverless para upload de arquivos 
para o AWS S3 usando Node.js (AWS Lambda) e gerenciado com AWS SAM (Serverless Application Model). 
Ele fornece uma API REST via API Gateway para receber arquivos,
validá-los e armazená-los de forma segura e eficiente.

Visão Geral da Arquitetura
O serviço segue uma arquitetura serverless robusta:

Cliente: Envia uma requisição POST com o arquivo (codificado em Base64) para o endpoint da API.

API Gateway: Atua como o ponto de entrada RESTful, roteando a requisição para a função Lambda.

AWS Lambda (Node.js): Recebe o corpo da requisição, decodifica o conteúdo do arquivo, realiza validações e interage com o S3.

AWS S3: Armazena os arquivos uploaded. Cada arquivo recebe um nome único (UUID) para evitar colisões.


Funcionalidades
API REST para Upload: Endpoint POST /upload para receber arquivos.

Validação de Entrada: Verifica a presença e o formato correto dos campos fileName, fileContent (Base64) e contentType.

Armazenamento no S3: Faz o upload dos arquivos para um bucket S3 configurável.

Nomes de Arquivo Únicos: Utiliza UUIDs para gerar nomes de arquivo exclusivos no S3, prevenindo sobrescrições.

Retorno da URL: Após o upload, a API retorna a URL pública do arquivo no S3.

Tratamento de Erros: Respostas HTTP claras para diferentes cenários de erro (ex: requisição inválida, erro interno do servidor).

Infraestrutura como Código (IaC): Toda a infraestrutura é definida e gerenciada via AWS SAM.


Tecnologias Utilizadas
AWS Lambda: Ambiente de execução serverless para o código Node.js.

Node.js 20.x: Linguagem de programação da função Lambda.

AWS API Gateway: Serviço para criação de APIs RESTful.

AWS S3: Serviço de armazenamento de objetos.

AWS SAM (Serverless Application Model): Framework para construir, implantar e gerenciar aplicações serverless na AWS.

uuid: Biblioteca para geração de identificadores únicos.

aws-sdk: SDK oficial da AWS para Node.js (já disponível no ambiente Lambda).


Segurança e Boas Práticas
Este projeto incorpora as seguintes boas práticas:

Princípio do Menor Privilégio: A função Lambda possui apenas as permissões IAM mínimas necessárias para interagir com o S3.

Validação de Entrada: Protege contra dados malformados ou incompletos.

Tratamento de Erros: Mensagens de erro claras e códigos de status HTTP apropriados.

Variáveis de Ambiente: Configurações como o nome do bucket S3 são gerenciadas via variáveis de ambiente, facilitando a portabilidade entre ambientes.

DeletionPolicy: Retain para S3: Garante que o bucket S3 e seus conteúdos não sejam acidentalmente excluídos se a pilha CloudFormation for removida.

CORS Configurado: Habilita o acesso da API para front-ends baseados em navegador (ajuste AllowOrigin para domínios específicos em produção).

Infraestrutura como Código: Facilita a revisão de código da infraestrutura, versionamento e automação de implantações (DevOps).

Licença
Este projeto está licenciado sob a licença MIT.