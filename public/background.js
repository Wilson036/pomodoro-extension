// 背景腳本 - 處理通知和鬧鈴
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'playAlarm') {
    // 顯示通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '番茄鐘提醒',
      message: request.message || '時間到了！',
      priority: 2
    });
    
    sendResponse({ success: true });
  }
  
  if (request.action === 'createAlarm') {
    chrome.alarms.create('pomodoroAlarm', {
      delayInMinutes: request.delayInMinutes
    });
    sendResponse({ success: true });
  }
  
  return true;
});

// 監聽鬧鐘
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroAlarm') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '番茄鐘提醒',
      message: '時間到了！',
      priority: 2
    });
  }
});

// 保持 service worker 活躍
chrome.runtime.onInstalled.addListener(() => {
  console.log('番茄鐘插件已安裝');
});
