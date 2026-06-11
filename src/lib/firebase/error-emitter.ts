type ErrorCallback = (error: Error) => void;

class ErrorEmitter {
  private listeners: ErrorCallback[] = [];

  subscribe(callback: ErrorCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(error: Error) {
    this.listeners.forEach((callback) => callback(error));
  }
}

export const errorEmitter = new ErrorEmitter();

export class FirestorePermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestorePermissionError';
  }
}