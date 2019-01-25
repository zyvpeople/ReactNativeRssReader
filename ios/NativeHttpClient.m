//
//  NativeHttpClient.m
//  RssReader
//
//  Created by Yaroslav Zozulia on 1/26/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NativeHttpClient.h"

@implementation NativeHttpClient

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(get,
                 getWithUrl: (NSString *)url
                 headers: (NSDictionary *)headers
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  NSURL *requestUrl = [NSURL URLWithString:url];
  NSURLSessionConfiguration *configuration = NSURLSessionConfiguration.defaultSessionConfiguration;
  NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:requestUrl];
  for (NSString* key in headers) {
    NSString *value = headers[key];
    [request addValue:value forHTTPHeaderField:key];
  }
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (!error) {
      NSString *result = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      resolve(result);
    } else {
      reject(@"NativeHttpClientError", @"Error perform GET request", error);
    }
  }];
  [task resume];
}

@end
