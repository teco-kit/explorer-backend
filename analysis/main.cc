#include <napi.h>
#include <iostream>

Napi::Promise SumAsyncPromise(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	uint32_t samples = info[0].As<Napi::Number>().Uint32Value();

	Napi::Uint16Array deltas = info[2].As<Napi::Uint16Array>();
	Napi::Uint16Array values = info[1].As<Napi::Uint16Array>();

	std::cout << "processing data..." << std::endl;
	std::cout << "samples: " << samples   << std::endl;

	auto deferred = Napi::Promise::Deferred::New(env);

	// proof of concept; do a simple calculation
	Napi::Number num = Napi::Number::New(env, deltas[0] + deltas[1]);

	deferred.Resolve(num);

	return deferred.Promise();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
	exports.Set(
		Napi::String::New(env, "analyze"),
		Napi::Function::New(env, SumAsyncPromise)
	);
	return exports;
}

NODE_API_MODULE(analysis, Init)
