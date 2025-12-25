import { useState, useEffect, useCallback } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

interface UseUserLocationResult {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
  permissionState: PermissionState | null;
}

export function useUserLocation(autoRequest: boolean = false): UseUserLocationResult {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  // Check permission state
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state);
        result.onchange = () => setPermissionState(result.state);
      });
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('Failed to get location');
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  // Auto-request if enabled and permission is already granted
  useEffect(() => {
    if (autoRequest && permissionState === 'granted') {
      requestLocation();
    }
  }, [autoRequest, permissionState, requestLocation]);

  return { location, error, isLoading, requestLocation, permissionState };
}
