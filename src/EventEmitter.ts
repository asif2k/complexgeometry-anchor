export default class EventEmitter {
  private listeners:any = {};
  
  on(event: string, callback: Function) {
    if (!this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    return this;
  }
  
  emit(event: string, ...data: any) {
    if (!this.listeners.hasOwnProperty(event)) {
      return null;
    }
    
    for (let i = 0; i < this.listeners[event].length; i++) {
      const callback = this.listeners[event][i];
      
      callback.call(this, ...data);
    }
  }
}