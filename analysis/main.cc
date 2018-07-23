#include <napi.h>
#include <iostream>
#include <array>
#include <utility>
#include <vector>

const float res_to_ppm = 0.4508319263648285;
const int stepsize = 30;

using namespace std;

Napi::Promise SumAsyncPromise(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	uint32_t samples = info[0].As<Napi::Number>().Uint32Value();

	Napi::Uint16Array deltas = info[2].As<Napi::Uint16Array>();
	Napi::Uint16Array values = info[1].As<Napi::Uint16Array>();

	auto deferred = Napi::Promise::Deferred::New(env);

	// calculate absolute time from deltas
	size_t timebuffer = 0;

	// data structure [[time, value], ...]
	vector<pair<float, float> > data;

	// populate vector
	for(uint32_t i = 0; i < samples; i++){
		// populate AbsTime Array (and convert to seconds)
		timebuffer += deltas[i];

		// pair <absulute time, ppm_value>
		pair<float, float> elem (timebuffer/1000, values[i] * res_to_ppm);

		data.push_back(elem);
	}

	// main iterator loop
	for(uint32_t i = 0; i < samples; i++){
		// subset[n ... n + stepsize]

		// check if we are out of bounds
		if(data[samples].first <= data[i].first + 0.9 * stepsize){
			// stop calculations
			break;
		}

		// STOP
	}

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
