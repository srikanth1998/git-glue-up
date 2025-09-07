
{
  "targets": [
    {
      "target_name": "wasapi_capture",
      "conditions": [
        ["OS=='win'", {
          "sources": [
            "src/audio/wasapi-capture.cpp",
            "src/bindings/wasapi-binding.cpp"
          ],
          "include_dirs": [
<<<<<<< HEAD
            "node_modules/nan",
=======
            "<!(node -p \"require('nan')\")",
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
            "deps/opus/include"
          ],
          "libraries": [
            "ole32.lib",
            "oleaut32.lib", 
            "winmm.lib",
            "ksuser.lib"
          ],
          "defines": [
            "WIN32_LEAN_AND_MEAN",
            "NOMINMAX"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1,
              "AdditionalOptions": ["/std:c++17"]
            }
          }
        }]
      ]
    },
    {
      "target_name": "macos_capture", 
      "conditions": [
        ["OS=='mac'", {
          "sources": [
            "src/audio/macos-capture.swift",
            "src/bindings/macos-binding.mm"
          ],
          "include_dirs": [
<<<<<<< HEAD
            "node_modules/nan", 
=======
            "<!(node -p \"require('nan')\")", 
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
            "deps/opus/include"
          ],
          "libraries": [
            "-framework AVFoundation",
            "-framework AudioToolbox", 
            "-framework CoreAudio"
          ],
          "xcode_settings": {
            "SWIFT_VERSION": "5.0",
            "CLANG_ENABLE_OBJC_ARC": "YES",
            "MACOSX_DEPLOYMENT_TARGET": "10.15"
          }
        }]
      ]
    }
  ]
}
