package com.gggame.quanguonn.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import org.cocos2dx.javascript.AppActivity;

/**
 * 网络工具
 * Created by zhangluxin on 2017/11/1.
 */

public class NetManager {
    private static final int NETWORK_NONE = -1;
    private static final int NETWORK_WIFI = 1;
    private static final int NETWORK_WAN = 2;

    public static int getNetype() {
        int netType = NETWORK_NONE;
        ConnectivityManager connMgr = (ConnectivityManager) AppActivity.getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connMgr == null)
            return netType;
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        if (networkInfo == null) {
            return netType;
        }
        int nType = networkInfo.getType();
        if (nType == ConnectivityManager.TYPE_MOBILE) {
            netType = NETWORK_WAN;
        } else if (nType == ConnectivityManager.TYPE_WIFI) {
            netType = NETWORK_WIFI;
        }
        return netType;
    }

    public static boolean isNetwork() {
        return getNetype() != NETWORK_NONE;
    }

    public static boolean isWifi() {
        return getNetype() == NETWORK_WIFI;
    }

    public static boolean isWAN() {
        return getNetype() == NETWORK_WAN;
    }

    public static void beginNetListener() {
    }

    public static void stopNetListener() {
    }
}
