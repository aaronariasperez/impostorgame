import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private db!: admin.firestore.Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Check if Firebase is already initialized
      if (admin.apps.length === 0) {
        let serviceAccount;
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

        if (serviceAccountPath) {
          // Check if it's a file path or JSON string
          if (serviceAccountPath.startsWith('{')) {
            // It's a JSON string
            serviceAccount = JSON.parse(serviceAccountPath);
          } else {
            // It's a file path - try multiple resolution strategies
            let resolvedPath = path.resolve(serviceAccountPath);
            
            // If file doesn't exist, try relative to process.cwd()
            if (!fs.existsSync(resolvedPath)) {
              resolvedPath = path.join(process.cwd(), serviceAccountPath);
            }
            
            // If still doesn't exist, try relative to __dirname
            if (!fs.existsSync(resolvedPath)) {
              resolvedPath = path.join(__dirname, '../../', serviceAccountPath);
            }

            const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
            serviceAccount = JSON.parse(fileContent);
          }
        } else {
          serviceAccount = {};
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }

      this.db = admin.firestore();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }
}
