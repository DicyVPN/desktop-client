exports.default = async function(configuration) {
    const {execSync} = require('child_process');
    const stdout = execSync(`signtool sign /a /fd SHA256 /tr http://time.certum.pl /td SHA256 ${configuration.path}`, {encoding: 'utf8'});
    if (stdout.match(/error/i)) {
        console.error(`Error during code signing: [${stdout}]`);
        throw `Error during code signing: [${stdout}]`;
    }
    // verify
    const verify = execSync(`signtool verify /pa ${configuration.path}`, {encoding: 'utf8'});
    if (verify.match(/error/i)) {
        console.error(`Error during code signing verification: [${verify}]`);
        throw `Error during code signing verification: [${verify}]`;
    }
};
