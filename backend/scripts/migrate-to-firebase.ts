import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function migrateWordPacks() {
  console.log('🔄 Starting word packs migration...');

  const wordPacksDir = path.join(process.cwd(), 'word_packs');

  if (!fs.existsSync(wordPacksDir)) {
    console.warn(`Word packs directory not found: ${wordPacksDir}`);
    return;
  }

  const files = fs.readdirSync(wordPacksDir).filter((file) =>
    file.endsWith('.json'),
  );

  const db = admin.firestore();

  for (const file of files) {
    try {
      const filePath = path.join(wordPacksDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      const categoryName = file.replace('.json', '');
      const categoryId = categoryName.toLowerCase();

      const wordItems = data.map((item: any) => ({
        word: item.p,
        attributes: item.a || [],
      }));

      const docData = {
        name: categoryName,
        description: `Palabras relacionadas con ${categoryName.toLowerCase()}`,
        language: 'es',
        wordItems,
      };

      await db.collection('word_packs').doc(categoryId).set(docData);
      console.log(`✅ Migrated word pack: ${categoryName}`);
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error);
    }
  }

  console.log('✅ Word packs migration completed');
}

async function migrateTelemetryLogs() {
  console.log('🔄 Starting telemetry logs migration...');

  const logsDir = path.join(process.cwd(), 'logs');
  const visitsFile = path.join(logsDir, 'telemetry-visits.jsonl');
  const eventsFile = path.join(logsDir, 'telemetry-events.jsonl');

  const db = admin.firestore();

  // Migrate visits
  if (fs.existsSync(visitsFile)) {
    try {
      const content = fs.readFileSync(visitsFile, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        const entry = JSON.parse(line);
        await db.collection('telemetry_visits').add(entry);
      }

      console.log(`✅ Migrated ${lines.length} visit logs`);
    } catch (error) {
      console.error('❌ Error migrating visits:', error);
    }
  }

  // Migrate events
  if (fs.existsSync(eventsFile)) {
    try {
      const content = fs.readFileSync(eventsFile, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        const entry = JSON.parse(line);
        await db.collection('telemetry_events').add(entry);
      }

      console.log(`✅ Migrated ${lines.length} event logs`);
    } catch (error) {
      console.error('❌ Error migrating events:', error);
    }
  }

  console.log('✅ Telemetry logs migration completed');
}

async function main() {
  try {
    let serviceAccount;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountPath) {
      // Check if it's a file path or JSON string
      if (serviceAccountPath.startsWith('{')) {
        // It's a JSON string
        serviceAccount = JSON.parse(serviceAccountPath);
      } else {
        // It's a file path
        const fileContent = fs.readFileSync(serviceAccountPath, 'utf-8');
        serviceAccount = JSON.parse(fileContent);
      }
    } else {
      serviceAccount = {};
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }

    await migrateWordPacks();
    await migrateTelemetryLogs();

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
