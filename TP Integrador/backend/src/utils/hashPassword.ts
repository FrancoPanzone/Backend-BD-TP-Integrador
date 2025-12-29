// extra para probar byscript y poner los mocks hasheados

import bcrypt from 'bcrypt';

async function generateHashes() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  console.log('\n=== Hashes generados ===');
  console.log('Admin password ("admin123"):\n', adminHash);
  console.log('User password ("user123"):\n', userHash);
  console.log('\nCopia estos valores en tu MockUser.\n');
}

// ejecuta la función
//generateHashes();
