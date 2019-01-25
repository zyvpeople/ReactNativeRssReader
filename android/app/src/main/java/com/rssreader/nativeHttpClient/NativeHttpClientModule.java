package com.rssreader.nativeHttpClient;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

/**
 * yaroslavzozulia
 * 1/25/19.
 */
public class NativeHttpClientModule extends ReactContextBaseJavaModule {

    public NativeHttpClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NativeHttpClient";
    }

    @ReactMethod
    public void get(String url,
                    ReadableMap headers,
                    Promise promise) {
        HttpURLConnection urlConnection = null;
        try {
            URL requestUrl = new URL(url);
            urlConnection = (HttpURLConnection) requestUrl.openConnection();
            for (Map.Entry<String, Object> entry : headers.toHashMap().entrySet()) {
                urlConnection.setRequestProperty(entry.getKey(), entry.getValue().toString());
            }
            promise.resolve(readStream(urlConnection.getInputStream()));
        } catch (Exception e) {
            promise.reject(e);
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
    }

    private String readStream(InputStream in) throws IOException {
        BufferedReader reader = null;
        StringBuilder response = new StringBuilder();
        try {
            reader = new BufferedReader(new InputStreamReader(in));
            String line = "";
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        } finally {
            if (reader != null) {
                reader.close();
            }
        }
        return response.toString();
    }
}
