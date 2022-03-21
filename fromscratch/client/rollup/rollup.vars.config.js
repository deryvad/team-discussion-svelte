let variables = {
    dev: {
        bucketName: '2613-sharingan-dev',
        region: 'us-east-1'
    }
}

export const getVariables = (env) => {
    let envToUse = ""
    switch (env) {
        case 'dev':
            envToUse = 'dev'
            break;
        case 'p':
        case 'prod':
        case 'production':
            envToUse = 'prod'
            break;
        case 'stage':
            envToUse = 'stage'
            break;
        default: 
            envToUse = 'dev'
            break;
    }

    return variables[envToUse];
}