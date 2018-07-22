#include <napi.h>

Napi::Promise SumAsyncPromise(const Napi::CallbackInfo& info) {
	Napi::Env env = info.Env();

	auto deferred = Napi::Promise::Deferred::New(env);

	if (info.Length() != 2)
		deferred.Reject(
		Napi::TypeError::New(
			env,
			"Invalid argument count. Use 2 Arguments"
		).Value());
	else {
		double arg0 = info[0].As<Napi::Number>().DoubleValue();
		double arg1 = info[1].As<Napi::Number>().DoubleValue();
		Napi::Number num = Napi::Number::New(env, arg0 + arg1);

		deferred.Resolve(num);
	}

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
