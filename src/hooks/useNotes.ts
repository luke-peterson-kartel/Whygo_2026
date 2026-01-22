import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import type { Note } from '@/types/whygo.types';

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  error: Error | null;
  addNote: (text: string) => Promise<void>;
}

/**
 * Hook to fetch and manage notes for a WhyGO in real-time
 */
export function useNotes(whygoId: string): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!whygoId) {
      setLoading(false);
      return;
    }

    const notesRef = collection(db, 'whygos', whygoId, 'notes');
    const notesQuery = query(notesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData: Note[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];

        setNotes(notesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [whygoId]);

  const addNote = async (text: string) => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    if (!text.trim()) {
      throw new Error('Note text cannot be empty');
    }

    try {
      const notesRef = collection(db, 'whygos', whygoId, 'notes');
      await addDoc(notesRef, {
        whygoId,
        text: text.trim(),
        authorId: user.firebaseUid || user.id,
        authorName: user.name,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  return { notes, loading, error, addNote };
}
