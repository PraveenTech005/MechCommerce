// Simple in-memory store for passing data between screens
// Resets when app restarts — fine for temporary image URIs

let _pendingImages = [];
let _listener = null;

const imageStore = {
  add(uri) {
    _pendingImages.push(uri);
    _listener?.(_pendingImages);
  },

  consume() {
    const images = [..._pendingImages];
    _pendingImages = [];
    return images;
  },

  onChange(fn) {
    _listener = fn;
    return () => {
      _listener = null;
    }; // returns unsubscribe
  },
};

export default imageStore;
