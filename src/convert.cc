#include <Magick++.h>
#include <node_buffer.h>
#include <iostream>
#include <string.h>
#include "./convert.h"

using namespace v8;

static Magick::GravityType getGravityType(std::string gravity) {
  if (gravity == "CenterGravity")
    return Magick::CenterGravity;
  else if (gravity == "EastGravity")
    return Magick::EastGravity;
  else if (gravity == "ForgetGravity")
    return Magick::ForgetGravity;
  else if (gravity == "NorthEastGravity")
    return Magick::NorthEastGravity;
  else if (gravity == "NorthGravity")
    return Magick::NorthGravity;
  else if (gravity == "NorthWestGravity")
    return Magick::NorthWestGravity;
  else if (gravity == "SouthEastGravity")
    return Magick::SouthEastGravity;
  else if (gravity == "SouthGravity")
    return Magick::SouthGravity;
  else if (gravity == "SouthWestGravity")
    return Magick::SouthWestGravity;
  else if (gravity == "WestGravity")
    return Magick::WestGravity;
  else {
    return Magick::ForgetGravity;
  }
}

static std::string toString(Handle<Value> str) {
  return std::string(*NanUtf8String(str));
}

class ConvertWorker : public NanAsyncWorker {
public:
  ConvertWorker(std::string src, Handle<Array> options, NanCallback *callback) : NanAsyncWorker(callback), srcFilename(src) {
    this->Initialize(options);
  }

  ConvertWorker(Handle<Value> src, Handle<Array> options, NanCallback *callback) : NanAsyncWorker(callback), srcBlob(node::Buffer::Data(src), node::Buffer::Length(src)) {
    // Create a Blob out of src buffer
    this->Initialize(options);
  }

  ~ConvertWorker () {
    delete [] opts;
  }

  void Initialize (Handle<Array> options) {
    opts_length = options->Length();
    opts = new std::string[opts_length];
    for (unsigned int i = 0; i < options->Length(); ++i) {
      opts[i] = toString(options->Get(i));
    }
  }

  // Executed inside the worker-thread.
  // It is not safe to access V8, or V8 data structures
  // here, so everything we need for input and output
  // should go on `this`.
  void Execute () {
    std::string method;
    std::string arg;
    Magick::GravityType gravity;
    Magick::InitializeMagick(NULL);

    try {
      if (!srcFilename.empty()) {
        image.read(srcFilename);
      } else {
        image.read(srcBlob);
      }

      // Strip everything, reduce size
      image.strip();

      // Interlace this sauce
      image.interlaceType(Magick::InterlaceType::PlaneInterlace);

      for (unsigned int i = 0; i < opts_length; ++i) {
        method = opts[i];
        arg = opts[++i];
        // std::cout << "method: ";
        // std::cout << method;
        // std::cout << " - ";
        // std::cout << arg;
        // std::cout << "\n";

        if (method == "quality") {
          image.quality(std::stoi(arg));
        } else if (method == "format") {
          image.magick(arg);
        } else if (method == "resize") {
          image.resize(arg);
        } else if (method == "extent") {
          gravity = getGravityType(opts[i + 1]);
          // If there's no gravity
          if (gravity == Magick::ForgetGravity) {
            image.extent(arg, Magick::Color("transparent"));
          }
          // If there is
          else {
            image.extent(arg, Magick::Color("transparent"), gravity);
            i++;
          }
        } else if (method == "blurSigma") {
          image.blur(0, std::stoi(arg));
        }
      }
    } catch (const std::exception &err) {
      SetErrorMessage(err.what());
    } catch (...) {
      SetErrorMessage("Convert failed in im-native");
    }
  }

  void HandleOKCallback () {
    NanScope();
    Magick::Blob blob;
    image.write(&blob);

    Local<Value> argv[] = {
      NanNull(),
      NanNewBufferHandle((char *)blob.data(), blob.length())
    };

    callback->Call(2, argv);
  }
private:
  std::string srcFilename;
  Magick::Blob srcBlob;
  Magick::Image image;
  std::string *opts;
  unsigned int opts_length;
};


// Asynchronous access to the `Estimate()` function
NAN_METHOD(Convert) {
  NanScope();

  NanCallback *callback = new NanCallback(args[2].As<Function>());
  Handle<Array> opts =args[1].As<Array>();

  if (args[0]->IsString()) {
    NanAsyncQueueWorker(new ConvertWorker(toString(args[0]), opts, callback));
  } else {
    NanAsyncQueueWorker(new ConvertWorker(args[0], opts, callback));
  }

  NanReturnUndefined();
}
