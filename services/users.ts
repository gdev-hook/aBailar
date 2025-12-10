import { db } from '@/config/firebase';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export interface UserPermissions {
  permissions: string[];
}

export const createUserDocument = async (
  userId: string,
  email: string,
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || null,
        permissions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error al crear documento de usuario:', error);
    throw error;
  }
};

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return (data.permissions as string[]) || [];
    }

    return [];
  } catch (error) {
    console.error('Error al obtener permisos de usuario:', error);
    return [];
  }
};

export const updateUserPermissions = async (
  userId: string,
  permissions: string[]
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      permissions,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error al actualizar permisos de usuario:', error);
    throw error;
  }
};
