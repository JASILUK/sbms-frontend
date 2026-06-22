export function captureDeviceCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Browser environment framework context isolates device geolocation anchors capability.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let msg = 'Failed to fetch device spatial position coordinate sets logs.';
        if (error.code === error.PERMISSION_DENIED) msg = 'Location authorization request rejected by device user.';
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}