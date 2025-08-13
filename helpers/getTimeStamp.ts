export function getTimestamp() {
  const now = new Date();
  
  const date =
    now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');

  const time =
    String(now.getHours()).padStart(2, '0') + '-' +
    String(now.getMinutes()).padStart(2, '0');

  return { date, time };
  }
  
export function getDate() {
    const now = new Date();
    
    const date =
      now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  
    return { date };
    }