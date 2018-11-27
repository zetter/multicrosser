class MoveBuffer {
  constructor(key) {
    this.storage = window.localStorage;
    this.key = `move-buffer-${key}`;
  }

  queue(move) {
    const existingItems = this.getObject();
    existingItems.push(move);
    this.setObject(existingItems);
  }

  deqeueAll() {
    const existingItems = this.getObject();
    this.setObject([]);
    return existingItems;
  }

  setObject(object) {
    this.storage.setItem(this.key, JSON.stringify(object));
  }

  getObject() {
    return JSON.parse(this.storage.getItem(this.key)) || [];
  }
}

export default MoveBuffer;
