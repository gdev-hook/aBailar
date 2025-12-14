import { db, storage } from '@/config/firebase';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export interface Post {
  id: string;
  imageUrl: string;
  aspectRatio?: number;
  userId: string;
  userEmail: string;
  userName?: string;
  userPhotoURL?: string;
  createdAt: Date;
  timestamp: Timestamp;
  eventDate?: Date;
  provinceId?: number;
}

export const uploadImage = async (
  uri: string,
  userId: string
): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `posts/${userId}/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

export const createPost = async (
  imageUrl: string,
  userId: string,
  userEmail: string,
  userName?: string,
  userPhotoURL?: string,
  eventDate?: Date,
  provinceId?: number,
  aspectRatio?: number
): Promise<void> => {
  try {
    await addDoc(collection(db, 'posts'), {
      imageUrl,
      userId,
      userEmail,
      userName: userName || userEmail.split('@')[0],
      userPhotoURL: userPhotoURL || null,
      createdAt: Timestamp.now(),
      timestamp: Timestamp.now(),
      eventDate: eventDate ? Timestamp.fromDate(eventDate) : null,
      provinceId: provinceId || null,
      aspectRatio: aspectRatio || null,
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    throw error;
  }
};

const PAGE_SIZE = 10;

export interface PostsResponse {
  posts: Post[];
  lastVisible: any;
}

export const getPosts = async (
  lastVisible: any = null
): Promise<PostsResponse> => {
  try {
    let q = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc'),
      limit(PAGE_SIZE)
    );

    if (lastVisible) {
      q = query(
        collection(db, 'posts'),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(q);
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

    const posts: Post[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      timestamp: doc.data().timestamp,
      eventDate: doc.data().eventDate?.toDate() || undefined,
      provinceId: doc.data().provinceId || undefined,
      aspectRatio: doc.data().aspectRatio || undefined,
    })) as Post[];

    return { posts, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error('Error al obtener posts:', error);
    throw error;
  }
};
