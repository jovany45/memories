// Test direct de l'API admin
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testAdminAPI() {
  try {
    // 1. Login avec compte admin
    console.log('🔐 Connexion avec compte admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jovanybernez@gmail.com',
        password: 'votre_mot_de_passe' // Remplacez par votre mot de passe
      })
    });

    if (!loginRes.ok) {
      console.error('❌ Erreur login:', await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    console.log('✅ Connecté:', loginData.user);
    console.log('🔑 Token:', loginData.token.substring(0, 20) + '...');
    console.log('👤 Role:', loginData.user.role);

    // 2. Test API admin/users
    console.log('\n📋 Test API admin/users...');
    const usersRes = await fetch(`${API_URL}/admin/users?limit=10`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!usersRes.ok) {
      const errorText = await usersRes.text();
      console.error('❌ Erreur API admin/users:', usersRes.status, errorText);
      return;
    }

    const usersData = await usersRes.json();
    console.log(`✅ ${usersData.users.length} utilisateurs récupérés`);
    console.log('Premier utilisateur:', usersData.users[0]);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testAdminAPI();
