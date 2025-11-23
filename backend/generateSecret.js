// Script pour générer un JWT secret sécurisé
// Usage: node generateSecret.js

import crypto from 'crypto';

console.log('\n🔐 Générateur de JWT Secret\n');
console.log('━'.repeat(50));
console.log('\n📝 Voici ton JWT_SECRET sécurisé :\n');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\n━'.repeat(50));
console.log('\n💡 Copie cette clé dans tes variables d\'environnement Render');
console.log('   Variable: JWT_SECRET');
console.log('   Valeur: (la clé générée ci-dessus)\n');
