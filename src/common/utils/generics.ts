// ==========================================
// BUỔI 1: GENERICS TRONG TYPESCRIPT
// Cung cấp các hàm tiện ích tái sử dụng linh hoạt với kiểu tham số hóa
// ==========================================

/**
 * Interface Generic đại diện cho phản hồi từ API giả lập
 */
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Hàm Generic lọc mảng phần tử theo predicate function
 */
export function filterCollection<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

/**
 * Hàm Generic sắp xếp mảng theo một thuộc tính của T (ràng buộc K extends keyof T)
 */
export function sortByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB, 'vi');
    } else if (valA > valB) {
      comparison = 1;
    } else {
      comparison = -1;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Hàm Generic tìm kiếm chuỗi trong nhiều trường khác nhau của object
 */
export function searchByFields<T>(
  items: T[],
  query: string,
  fields: Array<keyof T>
): T[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    fields.some((field) => {
      const val = item[field];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(normalizedQuery);
      }
      return false;
    })
  );
}

/**
 * Generic helper lưu trữ và đọc dữ liệu localStorage an toàn
 */
export function getLocalStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}
