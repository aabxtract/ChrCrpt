'use client';

import { useCallback } from 'react';
import { generateNotificationPayload } from '@/ai/flows/countdown-completion-alert';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function parseUserAgent() {
  if (typeof navigator === 'undefined') {
    return { browserType: 'unknown', browserVersion: 'unknown', osName: 'unknown', osVersion: 'unknown' };
  }
  const ua = navigator.userAgent;
  let browserType = 'Unknown', osName = 'Unknown';

  if (ua.includes("Firefox")) browserType = "Firefox";
  else if (ua.includes("SamsungBrowser")) browserType = "Samsung Browser";
  else if (ua.includes("Opera") || ua.includes("OPR")) browserType = "Opera";
  else if (ua.includes("Edge")) browserType = "Edge";
  else if (ua.includes("Chrome")) browserType = "Chrome";
  else if (ua.includes("Safari")) browserType = "Safari";
  
  if (ua.includes("Windows")) osName = "Windows";
  else if (ua.includes("Mac OS")) osName = "macOS";
  else if (ua.includes("Linux")) osName = "Linux";
  else if (ua.includes("Android")) osName = "Android";
  else if (ua.includes("like Mac OS")) osName = "iOS";
  
  const versionMatch = ua.match(/(?:Chrome|Firefox|Edge|Version)\/([\d\.]+)/);
  const browserVersion = versionMatch ? versionMatch[1] : 'unknown';

  return { browserType, browserVersion, osName, osVersion: 'unknown' };
}


export function useNotification() {
  const sendNotification = useCallback(async (title: string, message: string) => {
    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }
    
    try {
      const { browserType, browserVersion, osName, osVersion } = parseUserAgent();
      const iconUrl = PlaceHolderImages.find(img => img.id === 'notification-icon')?.imageUrl || '';

      const { payload } = await generateNotificationPayload({
        browserType,
        browserVersion,
        osName,
        osVersion,
        title,
        message,
        iconUrl,
      });

      const notificationOptions = JSON.parse(payload);
      new Notification(notificationOptions.title, notificationOptions);

    } catch (error) {
      console.error("Failed to generate or send notification:", error);
      // Fallback to a simple notification
      new Notification(title, { body: message });
    }
  }, []);

  return { sendNotification };
}
