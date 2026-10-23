import { useContext } from 'react';
import { TrackerContext } from './trackerContextInstance';

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
}
