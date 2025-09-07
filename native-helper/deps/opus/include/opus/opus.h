#ifndef OPUS_H
#define OPUS_H

// Dummy Opus header - replace with real implementation
typedef struct OpusEncoder OpusEncoder;
typedef struct OpusDecoder OpusDecoder;

#define OPUS_OK 0
#define OPUS_APPLICATION_VOIP 2048
#define OPUS_SET_BITRATE_REQUEST 4002
#define OPUS_SET_COMPLEXITY_REQUEST 4010
#define OPUS_SET_SIGNAL_REQUEST 4024
#define OPUS_SIGNAL_VOICE 3001

<<<<<<< HEAD
// Added minimal macro aliases expected by opus_encoder_ctl calls
#define OPUS_SET_BITRATE(x) OPUS_SET_BITRATE_REQUEST, x
#define OPUS_SET_COMPLEXITY(x) OPUS_SET_COMPLEXITY_REQUEST, x
#define OPUS_SET_SIGNAL(x) OPUS_SET_SIGNAL_REQUEST, x

// Stub implementations so linking succeeds when real Opus library is absent
#ifdef __cplusplus
extern "C" {
#endif

static inline OpusEncoder *opus_encoder_create(int /*Fs*/, int /*channels*/, int /*application*/, int *error) {
    if (error) *error = OPUS_OK;
    return (OpusEncoder*)0x1; // non-null dummy pointer
}

static inline int opus_encode_float(OpusEncoder* /*st*/, const float* /*pcm*/, int /*frame_size*/, unsigned char* /*data*/, int /*max_data_bytes*/) {
    return 0; // indicate no bytes encoded
}

static inline int opus_encoder_ctl(OpusEncoder* /*st*/, int /*request*/, ...) {
    return OPUS_OK;
}

static inline void opus_encoder_destroy(OpusEncoder* /*st*/) {
    // no-op
}

#ifdef __cplusplus
}
#endif

=======
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
// Dummy function declarations
#ifdef __cplusplus
extern "C" {
#endif

OpusEncoder *opus_encoder_create(int Fs, int channels, int application, int *error);
int opus_encode_float(OpusEncoder *st, const float *pcm, int frame_size, unsigned char *data, int max_data_bytes);
int opus_encoder_ctl(OpusEncoder *st, int request, ...);
void opus_encoder_destroy(OpusEncoder *st);

#ifdef __cplusplus
}
#endif

#endif