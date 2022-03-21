import rollup from './rollup.config';
import s3Plugin from "rollup-s3-plugin";
import aws from "aws-sdk";
import {environment, distfolder, minify} from './rollup.parts.config';
import {getVariables} from './rollup.vars.config';

let env = getVariables(environment());

let s3CommonOptions = {
    directory: distfolder,
    s3Options: {
        credentials: new aws.SharedIniFileCredentials({profile: 'mmedev'}),
        region: env.region,
        sslEnabled: true
    },
    s3UploadOptions: {
        Bucket: env.bucketName,
        ContentEncoding: 'gzip',
        ACL:"private"
    }
};

rollup.plugins = [
    ...rollup.plugins,
    minify,
    s3Plugin({
        include: /index.html/,
        ...s3CommonOptions
    }),
    s3Plugin({
        include: /.*\.(css|js)/,
        ...s3CommonOptions
    }),
    s3Plugin({
        include: /.*\.(png|jpg|jpeg|gif)/,
        directory: `${distfolder}/images`,
        ...s3CommonOptions
    })
];

export default rollup;