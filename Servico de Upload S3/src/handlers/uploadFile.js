const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();

/**
 * @typedef {object} UploadRequestPayload
 * @property {string} fileName 
 * @property {string} fileContent 
 * @property {string} contentType 
 */

/**
 * @param {object} event 
 * @param {object} event.body 
 * @returns {object} 
 */

exports.handler = async (event) => {
    console.log('Evento recebido:', JSON.stringify(event, null, 2));

    let payload;
    try {
        if (!event.body) {
            console.error('Erro: Corpo da requisição ausente.');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Corpo da requisição ausente.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }
        payload = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Requisição inválida: formato JSON esperado.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    const { fileName, fileContent, contentType } = payload;

    if (!fileName || !fileContent || !contentType) {
        console.error('Erro: Campos obrigatórios ausentes no payload.');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Campos "fileName", "fileContent" e "contentType" são obrigatórios.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    let buffer;
    try {
        buffer = Buffer.from(fileContent, 'base64');
    } catch (bufferError) {
        console.error('Erro ao decodificar base64:', bufferError);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Conteúdo do arquivo inválido (base64 malformado).' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName) {
        console.error('Erro de configuração: Variável de ambiente S3_BUCKET_NAME não definida.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro de configuração interna do servidor.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${uniqueFileName}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
    };

    try {
        await s3.upload(params).promise();
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;

        console.log(`Arquivo ${fileName} (${uniqueFileName}) uploaded com sucesso para ${fileUrl}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Arquivo uploaded com sucesso!',
                fileUrl: fileUrl
            }),
            headers: { 'Content-Type': 'application/json' },
        };
    } catch (uploadError) {
        console.error('Erro ao fazer upload para o S3:', uploadError);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor ao fazer upload do arquivo.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};