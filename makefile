all:
	rm -rf build
	emcmake  cmake -B build -DCMAKE_BUILD_TYPE=MinSizeRel
	make -C build
debug:
	rm -rf build
	emcmake  cmake -B build -DCMAKE_BUILD_TYPE=Debug
	make -C build
.phony: all debug