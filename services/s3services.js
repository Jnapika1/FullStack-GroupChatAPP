const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const uploadToS3=(data, filename, contentType)=>{
    const BUCKET = 'userexpensesheets';
    const IAM_USER_KEY = process.env.ACCESS_KEY;
    const IAM_SECRET_KEY = process.env.SECRET_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_SECRET_KEY,
    })

    var params = {
        Bucket: BUCKET,
        Key: filename,
        Body: data,
        ACL: 'public-read',
        ContentType: contentType
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response)=>{
            if(err){
                console.log('Something went wrong', err);
                reject(err);
            }
            else{
                // console.log('success', s3response);
                 resolve(s3response.Location);
            }
        })
    })

    
}

module.exports={
    uploadToS3
}