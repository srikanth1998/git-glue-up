<<<<<<< HEAD
class PCMWorklet extends AudioWorkletProcessor {
  process (inputs) {
    const ch = inputs[0][0];                       // mono
    if (!ch) return true;
    const buf = new Float32Array(ch);
    buf.set(ch);
    this.port.postMessage(buf.buffer, [buf.buffer]); // zero-copy
    return true;
  }
}
registerProcessor('pcm-worklet', PCMWorklet);
=======
class PCMWorklet extends AudioWorkletProcessor {
  process (inputs) {
    const ch = inputs[0][0];                       // mono
    if (!ch) return true;
    const buf = new Float32Array(ch);
    buf.set(ch);
    this.port.postMessage(buf.buffer, [buf.buffer]); // zero-copy
    return true;
  }
}
registerProcessor('pcm-worklet', PCMWorklet);
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
