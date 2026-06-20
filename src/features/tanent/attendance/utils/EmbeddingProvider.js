/**
 * Extensible Biometric Embedding Contract Strategy Interface.
 */
export class BaseEmbeddingProvider {
  async generateEmbedding(videoElement, detection) {
    throw new Error("Method 'generateEmbedding' must be explicitly overridden.");
  }
}

/**
 * Browser WebGL execution context strategy implementing localized face-api weights.
 */
export class FaceAPIEmbeddingProvider extends BaseEmbeddingProvider {
  async generateEmbedding(videoElement, detection) {
    if (!detection || !detection.descriptor) {
      throw new Error("Missing structural data maps descriptor matrix array.");
    }
    return Array.from(detection.descriptor);
  }
}

/**
 * Interface abstraction contract placeholder for future AI cloud inference provider migrations.
 */
export class AIEmbeddingProvider extends BaseEmbeddingProvider {
  async generateEmbedding(videoElement, detection) {
    // Left explicitly abstract to support drop-in replacements for remote AI inference endpoints
    // This preserves code layout throughout React frames, RTK queries, and Django contracts.
    throw new Error("AI Cloud Provider not implemented yet.");
  }
}

// Instantiate and expose the active provider instance safely
export const activeEmbeddingProvider = new FaceAPIEmbeddingProvider();