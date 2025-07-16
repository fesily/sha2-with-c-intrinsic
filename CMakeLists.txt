cmake_minimum_required(VERSION 3.0.0)
project (sha-with-intrinsic C ASM)

set(INCLUDE_DIR ${PROJECT_SOURCE_DIR}/include)
set(SRC_DIR ${PROJECT_SOURCE_DIR}/src)
set(TESTS_DIR ${PROJECT_SOURCE_DIR}/tests)

include_directories(${INCLUDE_DIR})
include_directories(${INCLUDE_DIR}/internal)

include(cmake/arch.cmake)

set(CMAKE_C_STANDARD 11)
# Depends on SRC_DIR
# and on arch.cmake
include(cmake/sources.cmake)

if(EMSCRIPTEN)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build.emscripten)

set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fno-exceptions -flto")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -s WASM=1 -s MODULARIZE -s EXPORT_ES6 -s EXPORTED_FUNCTIONS=['_Proof','_mysha256','_malloc','_free'] -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','HEAPU8','HEAPU32']")

add_executable(${PROJECT_NAME}
 
               ${SHA_SOURCES}
               "main_wasm.c"
)
else()
include(cmake/compilation-flags.cmake)

set(OPENSSL_USE_STATIC_LIBS TRUE)
find_package(OpenSSL REQUIRED)

add_executable(${PROJECT_NAME}
 
               ${SHA_SOURCES}
               ${OPENSSL_SOURCES}
               ${MAIN_SOURCE}
)
target_link_libraries(${PROJECT_NAME} OpenSSL::Crypto)

endif()

