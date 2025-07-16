FROM emscripten/emsdk

COPY . /workspaces/sha2-with-c-intrinsic
WORKDIR /workspaces/sha2-with-c-intrinsic
RUN emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release 
RUN cmake --build build --config Release --target all -j `nproc` --

RUN zip -r build.emscripten.zip build.emscripten
