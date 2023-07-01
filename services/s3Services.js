const AWS = require('aws-sdk')

exports.uploadToS3= async (file,filename) => {
    
        let s3Bucket = new AWS.S3({
            accessKeyId:process.env.IAM_USER_KEY,
            secretAccessKey:process.env.IAM_SECRET_KEY,
        }) 
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: file.path,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }
        
        console.log(file,"pBODY")
            //  s3Bucket.upload(params,  (err,S3response) =>{
            //     if(err){
            //         console.log('ERR in S3_BUCKET.UPLOAD',err)
                    
            //     }
            //     else{
            //         console.log('S3 UPLOAD SUCCESSFUL',S3response.Location)
            //         return  S3response.Location;
            //     }
            // });
        
            try {
                const S3response = await s3Bucket.upload(params).promise();
                console.log('S3 UPLOAD SUCCESSFUL', S3response.Location);
                return S3response.Location;
              } catch (err) {
                console.log('ERR in S3_BUCKET.UPLOAD', err);
                throw err;
              }
    
}