package com.gggame.quanguonn.utils;

import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;

/**
 * 阿里云推送工具
 */
public class AliPushUtil {
    private static final String TAG = "yygame";
    /**
     * 单例
     */
    private static AliPushUtil instance = null;

    /**
     * 单例
     */
    public static AliPushUtil getInstance() {
        if (instance == null) {
            instance = new AliPushUtil();
        }
        return instance;
    }

    public void init(Context applicationContext) {
        initCloudChannel(applicationContext);
    }

    /**
     * 初始化云推送通道
     */
    private void initCloudChannel(Context applicationContext) {
        Log.i("initCloudChannel", "初始化云推送通道");
        PushServiceFactory.init(applicationContext);
        CloudPushService pushService = PushServiceFactory.getCloudPushService();
        pushService.register(applicationContext, new CommonCallback() {
            @Override
            public void onSuccess(String response) {
                Log.d(TAG, "init cloudchannel success");
            }

            @Override
            public void onFailed(String errorCode, String errorMessage) {
                Log.d(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
            }
        });
    }
}
