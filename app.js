require('dotenv').config();



require('aws-sdk/lib/maintenance_mode_message').suppress = true; //this might not be necessary but I was getting some weird console prints and I had to use it

const AWS = require('aws-sdk');

const {v4 : uuidv4} = require('uuid'); //this helps to add randomness to the file names

const {S3Client,PutObjectCommand} = require("@aws-sdk/client-s3");

AWS.config.update({

    region : process.env.REGION,
    credentials : {
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId : process.env.AWS_ACCESS_KEY_ID
    }
});

const fs = require('fs');

const client = new S3Client(AWS.config);


const BUCKET_NAME = process.env.BUCKET_NAME;

//put file name here


const __key = `invoices/${uuidv4()}`; //this is folder targeted. Using the uuidv4 function only wiuld be enough if we are targeting the bucket root

async function uploadFile(){
    const fileContent = fs.readFileSync('MEMORANDOM.pdf'); //MEMORANDOM.pdf is the name of the file in this case and it is to be read from memory (ROM)

    const params = {
        Bucket : BUCKET_NAME,
        Key : __key,
        Body : fileContent,
        ACL : 'public-read',
        ContentType : 'application/pdf' //put file content type here ; I was strictly storing PDF here.  A function should be written to get the MIME/type from the file extension
    };


    try {

        const command = new PutObjectCommand(params);

        await client.send(command)

     //  console.log(`https://${BUCKET_NAME}.s3.amazonaws.com/${__key}`); for some weird reason, aws was not returning the file url 

         return `https://${BUCKET_NAME}.s3.amazonaws.com/${__key}`
        
    } catch (error) {
        console.error(error);
    }

  
};


uploadFile();





