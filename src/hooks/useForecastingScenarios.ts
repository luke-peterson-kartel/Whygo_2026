import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { calculateForecast } from '@/lib/utils/forecastCalculations';
import type { ForecastingScenario, ScenarioInputs, ScenarioType } from '@/types/forecasting.types';

export interface UseForecastingScenariosOptions {
  year?: number;
}

export interface UseForecastingScenariosReturn {
  scenarios: ForecastingScenario[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createScenario: (data: CreateScenarioData) => Promise<CreateScenarioResult>;
  updateScenario: (id: string, data: Partial<CreateScenarioData>) => Promise<UpdateScenarioResult>;
  deleteScenario: (id: string) => Promise<DeleteScenarioResult>;
  creating: boolean;
}

export interface CreateScenarioData {
  name: string;
  description: string;
  type: ScenarioType;
  inputs: ScenarioInputs;
  isActive?: boolean;
}

export interface CreateScenarioResult {
  success: boolean;
  scenarioId?: string;
  error?: string;
}

export interface UpdateScenarioResult {
  success: boolean;
  error?: string;
}

export interface DeleteScenarioResult {
  success: boolean;
  error?: string;
}

/**
 * Hook to manage forecasting scenarios in Firebase
 */
export function useForecastingScenarios(
  options: UseForecastingScenariosOptions = {},
  user?: { email: string; name: string }
): UseForecastingScenariosReturn {
  const { year = 2026 } = options;

  const [scenarios, setScenarios] = useState<ForecastingScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const scenariosRef = collection(db, 'forecasting_scenarios');
      // Simple query - filter by year only, sort client-side to avoid needing composite index
      const q = query(
        scenariosRef,
        where('year', '==', year)
      );

      const querySnapshot = await getDocs(q);
      const loadedScenarios: ForecastingScenario[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForecastingScenario[];

      // Sort by createdAt descending (newest first) client-side
      loadedScenarios.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      setScenarios(loadedScenarios);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError('Failed to load scenarios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createScenario = async (data: CreateScenarioData): Promise<CreateScenarioResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setCreating(true);

    try {
      // Calculate outputs from inputs
      const outputs = calculateForecast(data.inputs);

      // Generate a unique ID
      const scenarioId = `scenario_${year}_${Date.now()}`;

      const scenarioDoc: Omit<ForecastingScenario, 'id'> = {
        name: data.name.trim(),
        description: data.description.trim(),
        type: data.type,
        year,
        isActive: data.isActive ?? false,
        inputs: data.inputs,
        outputs,
        createdBy: user.email,
        createdByName: user.name,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      const scenarioRef = doc(db, 'forecasting_scenarios', scenarioId);
      await setDoc(scenarioRef, scenarioDoc);

      // Refetch to get the updated list
      await loadScenarios();

      setCreating(false);
      return { success: true, scenarioId };
    } catch (err) {
      console.error('Error creating scenario:', err);
      setCreating(false);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create scenario',
      };
    }
  };

  const updateScenario = async (
    id: string,
    data: Partial<CreateScenarioData>
  ): Promise<UpdateScenarioResult> => {
    try {
      const scenarioRef = doc(db, 'forecasting_scenarios', id);

      const updateData: Record<string, any> = {
        updatedAt: serverTimestamp(),
      };

      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.type !== undefined) updateData.type = data.type;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      if (data.inputs !== undefined) {
        updateData.inputs = data.inputs;
        updateData.outputs = calculateForecast(data.inputs);
      }

      await setDoc(scenarioRef, updateData, { merge: true });

      // Refetch to get the updated list
      await loadScenarios();

      return { success: true };
    } catch (err) {
      console.error('Error updating scenario:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update scenario',
      };
    }
  };

  const deleteScenario = async (id: string): Promise<DeleteScenarioResult> => {
    try {
      const scenarioRef = doc(db, 'forecasting_scenarios', id);
      await deleteDoc(scenarioRef);

      // Update local state
      setScenarios(prev => prev.filter(s => s.id !== id));

      return { success: true };
    } catch (err) {
      console.error('Error deleting scenario:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete scenario',
      };
    }
  };

  useEffect(() => {
    loadScenarios();
  }, [year]);

  return {
    scenarios,
    loading,
    error,
    refetch: loadScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
    creating,
  };
}
