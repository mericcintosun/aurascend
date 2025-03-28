/**
 * MongoDB ObjectID formatı kontrolü
 * @param {string} id - Kontrol edilecek ID
 * @returns {boolean} - ID'nin 24 karakter hexadecimal değer olup olmadığı
 */
export function isValidObjectId(id) {
  if (!id) return false;
  // MongoDB ObjectID'leri 24 karakter uzunluğunda hexadecimal değerlerdir
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Tarih formatını Türkçe olarak döndürür
 * @param {Date|string} date - Tarih nesnesi veya string 
 * @returns {string} - Formatlanmış tarih string'i
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Metni istenilen uzunlukta keser ve sonuna ... ekler
 * @param {string} text - Kesilecek metin
 * @param {number} maxLength - Maksimum karakter sayısı 
 * @returns {string} - Kesilmiş metin
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
} 