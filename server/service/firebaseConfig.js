const admin = require('firebase-admin');
const serviceAccount = require('/etc/secrets/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://happytails-902d9.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
